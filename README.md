# bbcrd-synth-study

This repository is a collection of scripts and guidelines that BBC R&D produced while making synthetic voices. We use [this implementation](https://github.com/Kyubyong/dc_tts) of [Efficiently Trainable Text-to-Speech System Based on Deep Convolutional Networks with Guided Attention](https://arxiv.org/abs/1710.08969) as the foundation for our work. The documentation provided will explain the different steps we took to get the best results out of it, making new voices quickly and cheaply.

# Requirements

The tools included inside [dataset](./dataset) were written in **Python 3**, however, the [DC_TTS implementation](https://github.com/Kyubyong/dc_tts) used for training and synthesizing the voice was written in **Python 2**. This will require you to set up two different Anaconda environments. Just remember to activate the necessary Anaconda environment before you start working with the dataset or synthesis code. You can find more information inside the [dataset](./dataset) and the [synthesis](./synthesis) sections. 

# Creating a training dataset

We produced a phonetically balanced corpus in English that you can use to create your own voice. Please take a look inside [dataset](./dataset) for more information on how to create a training dataset. 

# Training

For the training, we tune an existing model based on the [LJ dataset](https://keithito.com/LJ-Speech-Dataset/). You can find more information on how to train a new voice model inside [train](./train).

# Synthesis

Please take a look inside [synthesis](./synthesis) for more information on synthesizing speech using our modified script.

# Articles

We wrote [a series of articles]([]) detailing our process and technical choices.
