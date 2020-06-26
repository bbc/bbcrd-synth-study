import glob
import sys
import os

from pydub import AudioSegment
from pydub.playback import play
from pydub.effects import speedup
from pydub.silence import detect_silence

def error_print(s):
    sys.stderr.write(s)
    sys.stderr.write("\n")
    sys.stderr.flush()

def print_usage():
    error_print("Usage: %s wav_directory [max_silence_time_in_ms]" % sys.argv[0])

def compress_wav(file, max_silence_time):
    track = AudioSegment.from_file(file, format='wav')

    silences = detect_silence(track, min_silence_len=max_silence_time, silence_thresh=track.dBFS * 2, seek_step=1)

    compressed_track = AudioSegment.empty()
    prev_cursor = 0

    for silence in silences:
        compressed_track = compressed_track + track[prev_cursor:silence[0]]
        
        silence_track = track[silence[0]:silence[1]]
        speedup_track = speedup(silence_track, playback_speed=(len(silence_track) / max_silence_time), chunk_size=150, crossfade=100)

        fade_in = speedup_track.fade(
            from_gain=0,
            end=0,
            duration=250
        )

        compressed_track = compressed_track + fade_in

        prev_cursor = silence[1]

    compressed_track = compressed_track + track[prev_cursor:]

    compressed_track.export(file, format="wav")

if __name__ == "__main__":
    try:
        folder = sys.argv[1]
        max_silence_time = 500
    except:
        print_usage()
        sys.exit(1)

    if len(sys.argv) >= 3:
        max_silence_time = int(sys.argv[2])
    
    if os.path.exists(folder):
        files = glob.glob('%s/*.wav' % folder)

        for file in files:
            compress_wav(file, max_silence_time)
    else:
        error_print("%s directory doesn't exist" % (folder))
