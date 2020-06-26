# Dataset
In order to create a synthetic voice, you first have to create a Training Dataset which consists of a list of utterances in .wav format and their transcripts.
The Dataset should be in the same format as the [LJ Speech Dataset](https://keithito.com/LJ-Speech-Dataset/).
The original LJ Speech Dataset is about 24 hours long. However, we managed to create a voice with much less training data by training on top of the pre-trained LJ Speech model. 

# LJ Speech Dataset

## Statistics

The [LJ Speech Dataset](https://keithito.com/LJ-Speech-Dataset/) is a public domain speech dataset consisting of 13,100 short audio clips of a single speaker reading passages from 7 non-fiction books. A transcription is provided for each clip.
After analyzing it, here are some statistics about the dataset, including some additional ones which cannot be found on the official website:

|                     |           |
|---------------------|-----------|
| Total Clips         | 13,100    |
| Total Words         | 225,715   |
| Total Characters    | 1,308,678 |
| Total Duration      | 23:55:17  |
| Mean Clip Duration  | 6.57 sec  |
| Min Clip Duration   | 1.11 sec  |
| Max Clip Duration   | 10.10 sec |
| Mean Words Per Clip | 17.23     |
| Distinct Words      | 13,821    |

Below are some harder to find statistics, which are required to know when building your dataset.
These were gathered based on 1018 LJSpeech samples, which were fed through BBC R&D's own speech-to-text system in order to find exact word timings.
The most important statistic here is "Max Distance" (the maximum distance between any two consecutive words, in seconds) which can be used when deciding where to split an utterance,
and give you an idea how long should a pause be inside an utterance. **Restricting the length of pauses within utterances is critical because having arbitrarily long pauses can confuse the learning algorithm.**

|               |           |
|---------------|-----------|
| Min Distance  | -0.01 sec |
| Max Distance  | 0.74 sec  |
| Mean Distance | 0.022 sec |

## Structure

The directory structure of the dataset is like this:
```
LJSpeech-1.x/
├── metadata.csv
└── wavs/
    ├── utterance1.wav
    ├── utterance2.wav
    .
    .
    └── utteranceN.wav
    
```

In metadata.csv, each line should contain three fields: the utterance's .wav filename, the transcription of the utterance, and a normalized version of the transcription (numbers, ordinals, monetary units expanded into full words), separated by the pipe character. For example:
```
utterance1.wav|This is test utterance number 1.|This is test utterance number one.
utterance2.wav|This is test utterance number 2.|This is test utterance number two.
```

## Links

This dataset can be downloaded from the [official LJSpeech web site](https://keithito.com/LJ-Speech-Dataset/). 

# Requirements

The tools included here were written in **Python 3** and it is suggested that you set up an Anaconda environment before you install the requirements.


## 3. Install Anaconda
If you haven't done it already, please install Anaconda on your system. You can find out how to do this [here](https://docs.anaconda.com/anaconda/install/).

## 4. Set up your environment

```
# Set up a Python3 Anaconda environment
conda create -n bbcrd-synth-voices python=3.7
# Activate it
conda activate bbcrd-synth-voices
# Install Python 3 requirements
pip install -r requirements.txt
```

Remember to run `conda activate bbcrd-synth-voices` every time before you start working on the [dataset](./) from a new shell.

# Methodology

## 1. Gathering Text Data
Before recording a voice, you first have to prepare the training text data that will be narrated by the voice actor.  However, to achieve better results, the text should provide a variety of phoneme combinations, in a distribution that resembles the one found in the English language. **Simply put: If a word, or, more specifically, a phoneme combination is not present in the text corpus, the algorithm will not "know" how to pronounce it properly.**
We have already created such a phonetically balanced text corpus and included it in this repo here: [corpus.txt](./corpus.txt).

## 2. Pre-processing Text Data
After gathering the text data it needs to be pre-processed (normalized) in order to make the training task easier. One pre-processing step, for example, is the expansion of numbers into words (e.g. 3 -> "three", 3.14 -> "three point fourteen"). The [preprocess.py](./preprocess.py) script will take care of that. You can look into its source code to find the full list of pre-processing steps taken. You may run it like this:
```
python3 preprocess.py input_text.txt > output_text.txt
```

**Note:** if you use the [included text corpus](./corpus.txt), there is no need to run this step because it has already been pre-processed.

## 3. Record
When recording the voice you have to remember that the learning algorithm will try to recreate anything it receives as input. Here are some important points to consider when recording:
* Find a quiet environment
* The recording and voice conditions (e.g. voice loudness, position of the head) should stay consistent throughout the whole recording
* You should minimize the pause length within utterances — long pauses inside utterances might make training task harder.
* If you make a mistake and have to repeat a sentence, make sure you repeat it with a similar natural delivery. There's a tendency to repeat them slower or pause halfway to avoid making mistakes again but that might be detrimental to the training.
* To avoid sounding too robotic, try to speak as if you were speaking normally to a friend. You might even add some theatrical tone. This will reflect on the synthetic voice by sounding more human-like.
* Read exactly what is on the script and not what you think it should say (even where there are obvious mistakes or strange turns of phrases.
* Avoid making any other noises while speaking (phone ringing, keyboard clacking, etc.).
* Keep a consistent volume / pace throughout the whole sentence. Some people have the tendency to lower their volume, or increase their speed towards the end of the sentence. This has the effect of the synthetic voice "chopping down" the tail of each utterance.

We have written a script to help you record the sentences. It presents you with each sentence, allows you start a recording, and allows you to repeat the sentence or save it and move on.

You need to have [Sox](http://sox.sourceforge.net/) installed for the script to work. This can be done on Debian/Ubuntu using `sudo apt-get install sox`, or on Mac using `brew install sox`.

You can run the script as follows:
```
./record.sh corpus.txt output_folder
```

1. The script will show you the sentence you need to record.
1. Press Enter to start recording, then press Enter again to stop recording.
1. If you're happy with the take, press Enter to save that recording.
1. Otherwise, press Backspace to go back to step 2.

**Note:** if you are using your own corpus, make sure you have pre-processed it using the method described in the section above.


## 4. Process audio

We have written a script that processes the recorded files as follows:

1. Convert to mono 16-bit WAV
1. High-pass filter at 100Hz
1. Reduce noise using noise profile
1. Resample to 22050Hz
1. Compress the dynamic range
1. Normalise to -0.1dB
1. Remove any silence at the beginning and end

Firstly, you need to record some background noise for perhaps 30 seconds, then use the following command to generate a noise profile:
```
sox noise.wav -n noiseprof noise.profile
```

Then, you can process each of your recordings by running the following:
```
for i in output_folder/wavs/*.wav; do sh process-audio.sh $i processed_audio/wavs/`basename $i` noise.profile; done
```

**Warning:** the script operates on the `wavs` folder previously created and makes changes in place so you may want to keep a copy of the original directory.

Depending on the state of the recording, you might want to shorten silences within utterances. It helps to make sure pauses between words or after a comma are under a certain threshold to create a consistent output from the synthesiser. The script called [shorten-silence](./shorten-silence.py) uses PyDub to work out the silences and speeds up the ones longer than a given time. That silence length defaults to 500ms but you can change that with an argument. 

```
python3 shorten_silence.py ./output_folder/wavs 500
```

**Warning**: the script operates on the `wavs` folder previously created and makes changes in place so you may want to keep a copy of the original directory.
