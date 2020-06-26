#!/usr/bin/env python2
# -*- coding: utf-8 -*-

import os
import sounddevice
import soundfile
from hyperparams import Hyperparams as hp
from synthesize import Synthesizer

# Update the following two paths:
CHECKPOINT_TEXT2MEL = "models/LJ01-1/model_gs_1450k"
CHECKPOINT_SSRN = "models/LJ01-2/model_gs_767k"

def playsound(filename):
	data, fs = soundfile.read(filename, dtype='float32')  
	sounddevice.play(data, fs)
	status = sounddevice.wait()

if __name__ == "__main__":
	synthesizer = Synthesizer(CHECKPOINT_TEXT2MEL, CHECKPOINT_SSRN)
	filename = "utterance.wav"
	while True:
		utterance = raw_input("Enter an utterance: ")
		if not utterance:
			break
		synthesizer.synthesize(utterance, filename)
		print("Utterance saved in %s" % filename)
		playsound(filename)
