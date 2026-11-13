"""Generate original, deterministic Karbasan feedback sounds; no external samples."""
import math, random, struct, wave
from pathlib import Path
RATE=22050
OUT=Path(__file__).resolve().parents[1]/'assets/audio/karbasan'
OUT.mkdir(parents=True,exist_ok=True)
def write(name,duration,frequencies,volume=.35,ambient=False):
    random.seed(42)
    samples=[]
    for i in range(int(RATE*duration)):
        t=i/RATE
        if ambient:
            phase=t%4
            chord=frequencies[int(t//4)%len(frequencies)]
            value=sum(math.sin(2*math.pi*f*t)*math.exp(-phase*.8) for f in chord)/len(chord)
            value*=min(1,t/.5,(duration-t)/.5)*.17
        else:
            attack=min(1,t/.006)
            value=sum(math.sin(2*math.pi*f*t)*math.exp(-t*(8+j*3)/duration) for j,f in enumerate(frequencies))/len(frequencies)
            value=(value+random.uniform(-1,1)*math.exp(-t*95)*.22)*attack*volume
        samples.append(struct.pack('<h',max(-32767,min(32767,round(value*32767)))))
    with wave.open(str(OUT/(name+'.wav')),'wb') as out:
        out.setnchannels(1);out.setsampwidth(2);out.setframerate(RATE);out.writeframes(b''.join(samples))
for stage in range(1,6):
    frequency=190+stage*65
    write('merge-'+str(stage),.10+stage*.055,[frequency,frequency*2.01,frequency*3.13],.4)
write('break',.36,[140,310,640],.48)
write('chain',.85,[330,440,660,880],.35)
write('deliver',.5,[392,494,587],.32)
write('level',1.1,[392,494,587,784],.35)
write('ambience',16,[[196,247,294],[175,220,262],[165,208,247],[175,220,294]],ambient=True)
