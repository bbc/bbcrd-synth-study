#!/usr/bin/env python2
# -*- coding: utf-8 -*-

'''
By kyubyong park. kbpark.linguist@gmail.com.
https://www.github.com/kyubyong/dc_tts
'''

from __future__ import print_function

import os

from hyperparams import Hyperparams as hp
import numpy as np
import tensorflow as tf
import nltk.data
from train import Graph
from utils import *
from data_load import load_data
from data_load import load_vocab
from data_load import text_normalize
from scipy.io.wavfile import write
from tqdm import tqdm
import nltk.data
import nltk
from text import _clean_text 

class Synthesizer():
    def __init__(self, checkpoint_text2mel, checkpoint_ssrn):
        # Load data
        #self.L = load_data("synthesize")

        self._checkpoint_text2mel = os.path.realpath(checkpoint_text2mel)
        self._checkpoint_ssrn = os.path.realpath(checkpoint_ssrn)
        # Load graph
        self._graph = Graph(mode="synthesize")
        self._sess = tf.Session()
        self._sess.run(tf.global_variables_initializer())
        # Restore text2mel
        #var_list = tf.get_collection(tf.GraphKeys.TRAINABLE_VARIABLES, 'Text2Mel')
        #saver1 = tf.train.Saver(var_list=var_list)
        # https://stackoverflow.com/questions/41265035/tensorflow-why-there-are-3-files-after-saving-the-model
        var_list = tf.get_collection(tf.GraphKeys.TRAINABLE_VARIABLES, 'Text2Mel')
        saver1 = tf.train.Saver(var_list=var_list)
        saver1.restore(self._sess, self._checkpoint_text2mel)

        #saver1 = tf.train.import_meta_graph(self._checkpoint_text2mel + ".meta")
        #saver1.restore(self._sess, self._checkpoint_text2mel)

        # Restore ssrn
        #var_list = tf.get_collection(tf.GraphKeys.TRAINABLE_VARIABLES, 'SSRN') + \
        #           tf.get_collection(tf.GraphKeys.GLOBAL_VARIABLES, 'gs')
        #saver2 = tf.train.Saver(var_list=var_list)
        var_list = tf.get_collection(tf.GraphKeys.TRAINABLE_VARIABLES, 'SSRN') + \
                   tf.get_collection(tf.GraphKeys.GLOBAL_VARIABLES, 'gs')
        saver2 = tf.train.Saver(var_list=var_list)
        saver2.restore(self._sess, self._checkpoint_ssrn)
        
        #saver2 = tf.train.import_meta_graph(self._checkpoint_ssrn + ".meta")        
        #saver2.restore(self._sess, self._checkpoint_ssrn)
        
        self._char2idx, self._idx2char = load_vocab()

        # Make sure NLTK has the necessary data:
        nltk.download('punkt', quiet=True)
        self._sent_detector = nltk.data.load('tokenizers/punkt/english.pickle')

    def chunk_sentence(self, sentence):
        def split(text, stop):
            parts = text.split(stop)

            p = []
            
            for i, part in enumerate(parts):
                if i < len(parts) - 1:
                    p.append((part + stop).strip())
                else:
                    p.append(part)
            
            return p

        def join(array):
            final_items = []
            acc = ''

            for item in array:
                if len(acc) + len(item) > hp.max_N:
                    final_items.append(acc.strip())
                    acc = item
                else:
                    acc = acc + ' ' + item
            
            if len(acc) > 0:
                final_items.append(acc.strip())
            
            return final_items

        chunks = []
        
        if len(sentence) > hp.max_N:
            # split on ; then , then space
            for i in split(sentence, '; '):
                if len(i) > hp.max_N:
                    for j in split(i, ', '):
                        if len(j) > hp.max_N:
                            words = j.split(' ')
                            chunks.extend(join(words))
                        else:
                            chunks.append(j)
                else:
                    chunks.append(i)
        else:
            chunks.append(sentence)

        return join(chunks)

    def encode_text(self, text):
        if type(text) is not unicode:
            text = text.decode('utf-8')

        lines = text.splitlines()
        sents = []

        for line in lines:
            sents.extend(self._sent_detector.tokenize(line.strip()))
        
        norm_sents = [text_normalize(_clean_text(sent, ['english_cleaners']).decode('utf-8')).strip() for sent in sents]

        final_sents = []

        for sent in norm_sents:
            chunks = self.chunk_sentence(sent)
            
            for chunk in chunks:
                s = chunk
                
                if s.endswith(',') or s.endswith(';'):
                    s = s[:-1]
                
                final_sents.append(s + 'E')
    
        texts = np.zeros((len(final_sents), hp.max_N), np.int32)
        
        for i, sent in enumerate(final_sents):
            texts[i, :len(sent)] = [self._char2idx[char] for char in sent]
        
        return texts        

    def synthesize(self, text, filename_wav):
        L = self.encode_text(text)
        Y = np.zeros((len(L), hp.max_T, hp.n_mels), np.float32)
        prev_max_attentions = np.zeros((len(L),), np.int32)
        for j in tqdm(range(hp.max_T)):
            _gs, _Y, _max_attentions, _alignments = \
                self._sess.run([self._graph.global_step, self._graph.Y, self._graph.max_attentions, self._graph.alignments],
                         {self._graph.L: L,
                          self._graph.mels: Y,
                          self._graph.prev_max_attentions: prev_max_attentions})
            Y[:, j, :] = _Y[:, j, :]
            prev_max_attentions = _max_attentions[:, j]        
        # Get magnitude
        Z = self._sess.run(self._graph.Z, {self._graph.Y: Y})

        # Generate wav files
        wav_total = np.array([]).astype(np.float32)
        first_sentence = True
        for i, mag in enumerate(Z):
            wav_sentence = spectrogram2wav(mag)
            if first_sentence:
                first_sentence = False
                wav_total = wav_sentence
            else:
                silence = np.zeros(int(hp.sr * 0.7)).astype(np.float32)
                tmp = np.concatenate((wav_total, silence, wav_sentence))
                wav_total = tmp

        write(filename_wav, hp.sr, wav_total)

def synthesize():
    # Load data
    L = load_data("synthesize")

    # Load graph
    g = Graph(mode="synthesize"); print("Graph loaded")

    with tf.Session() as sess:
        sess.run(tf.global_variables_initializer())

        # Restore parameters
        var_list = tf.get_collection(tf.GraphKeys.TRAINABLE_VARIABLES, 'Text2Mel')
        saver1 = tf.train.Saver(var_list=var_list)
        saver1.restore(sess, tf.train.latest_checkpoint(hp.logdir + "-1"))
        print("Text2Mel Restored!")

        var_list = tf.get_collection(tf.GraphKeys.TRAINABLE_VARIABLES, 'SSRN') + \
                   tf.get_collection(tf.GraphKeys.GLOBAL_VARIABLES, 'gs')
        saver2 = tf.train.Saver(var_list=var_list)
        saver2.restore(sess, tf.train.latest_checkpoint(hp.logdir + "-2"))
        print("SSRN Restored!")

        # Feed Forward
        ## mel
        Y = np.zeros((len(L), hp.max_T, hp.n_mels), np.float32)
        prev_max_attentions = np.zeros((len(L),), np.int32)
        for j in tqdm(range(hp.max_T)):
            _gs, _Y, _max_attentions, _alignments = \
                sess.run([g.global_step, g.Y, g.max_attentions, g.alignments],
                         {g.L: L,
                          g.mels: Y,
                          g.prev_max_attentions: prev_max_attentions})
            Y[:, j, :] = _Y[:, j, :]
            prev_max_attentions = _max_attentions[:, j]

        # Get magnitude
        Z = sess.run(g.Z, {g.Y: Y})

        # Generate wav files
        if not os.path.exists(hp.sampledir): os.makedirs(hp.sampledir)
        for i, mag in enumerate(Z):
            print("Working on file", i+1)
            wav = spectrogram2wav(mag)
            write(hp.sampledir + "/{}.wav".format(i+1), hp.sr, wav)

if __name__ == '__main__':
    synthesize()
    print("Done")


