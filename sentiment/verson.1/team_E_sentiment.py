import json
from watson_developer_cloud import NaturalLanguageUnderstandingV1
import watson_developer_cloud.natural_language_understanding.features.v1 \
  as Features

natural_language_understanding = NaturalLanguageUnderstandingV1(
 username="02fb23e9-20d1-47da-bfa8-f380cb1a0bc9",
 password="gk3oevbKk7gD",
 version="2017-02-27"
)

def GetMiddleStr(target,frontStr,backStr):
  frontIndex = target.index(frontStr)
  if frontIndex>=0:
    frontIndex += len(frontStr)
  backIndex = target.index(backStr)
  return target[frontIndex:backIndex]

def GetLineStr(output):
    alllines = output.split('\n')
    lines=[]
    for oneline in alllines:
        lines.append(oneline)
    return lines

def GetKeyword(num,lines):
    key = []
    if num != 5:
        for i in range(1,num+1):
            a = GetMiddleStr(lines[9 + (i - 1) * 15], '"text": "', '", ')
            key.append(a)
        for k in range(num+1,5+1):
            b = "No data"
            key.append(b)
    if num == 5:
        for j in range(1,num+1):
            a = GetMiddleStr(lines[9 + (j - 1) * 15], '"text": "', '", ')
            key.append(a)
    return key

def GetAnger(num,lines):
    anger = []
    if num != 5:
        for i in range(1,num+1):
            a = GetMiddleStr(lines[11 + (i - 1) * 15], '"anger": ', ', ')
            anger.append(a)
        for k in range(num+1,5+1):
            b = "No data"
            anger.append(b)
    if num == 5:
        for j in range(1,num+1):
            a = GetMiddleStr(lines[11 + (j - 1) * 15], '"anger": ', ', ')
            anger.append(a)
    return anger

def GetJoy(num,lines):
    joy = []
    if num != 5:
        for i in range(1,num+1):
            a = GetMiddleStr(lines[12 + (i - 1) * 15], '"joy": ', ', ')
            joy.append(a)
        for k in range(num+1,5+1):
            b = "No data"
            joy.append(b)
    if num == 5:
        for j in range(1,num+1):
            a = GetMiddleStr(lines[12 + (j - 1) * 15], '"joy": ', ', ')
            joy.append(a)
    return joy

def GetSadness(num,lines):
    sadness = []
    if num != 5:
        for i in range(1,num+1):
            a = GetMiddleStr(lines[13 + (i - 1) * 15], '"sadness": ', ', ')
            sadness.append(a)
        for k in range(num+1,5+1):
            b = "No data"
            sadness.append(b)
    if num == 5:
        for j in range(1,num+1):
            a = GetMiddleStr(lines[13 + (j - 1) * 15], '"sadness": ', ', ')
            sadness.append(a)
    return sadness

def GetFear(num,lines):
    fear = []
    if num != 5:
        for i in range(1,num+1):
            a = GetMiddleStr(lines[14 + (i - 1) * 15], '"fear": ', ', ')
            fear.append(a)
        for k in range(num+1,5+1):
            b = "No data"
            fear.append(b)
    if num == 5:
        for j in range(1,num+1):
            a = GetMiddleStr(lines[14 + (j - 1) * 15], '"fear": ', ', ')
            fear.append(a)
    return fear

def GetDisgust(num,lines):
    disgust = []
    if num != 5:
        for i in range(1,num+1):
            c = lines[15 + (i - 1) * 15] + lines[16 + (i - 1) * 15]
            a = GetMiddleStr(c, '"disgust": ', '      }, ')
            disgust.append(a)
        for k in range(num+1,5+1):
            b = "No data"
            disgust.append(b)
    if num == 5:
        for j in range(1,num+1):
            c = lines[15 + (j - 1) * 15] + lines[16 + (j - 1) * 15]
            a = GetMiddleStr(c, '"disgust": ', '      }, ')
            disgust.append(a)
    return disgust

def GetEmotion(num,lines):
     emotion = []
     anger = GetMiddleStr(lines[-10], '"anger": ', ', ')
     emotion.append(anger)
     joy = GetMiddleStr(lines[-9], '"joy": ', ', ')
     emotion.append(joy)
     sadness = GetMiddleStr(lines[-8], '"sadness": ', ', ')
     emotion.append(sadness)
     fear = GetMiddleStr(lines[-7], '"fear": ', ', ')
     emotion.append(fear)
     c = lines[-6] + lines[-5]
     disgust = GetMiddleStr(c, '"disgust": ', '      }')
     emotion.append(disgust)
     return emotion

def outputToText(data):
    f = open('data.txt', 'a+')
    for i in data:
        f.write(i)
        f.write(",")
    f.write("\n")
    f.close()

def input():
    strings=""
    strings = raw_input("Please input the target text:\n")
    return strings




def sentiment_output(shuru):
    response = natural_language_understanding.analyze(
        text = shuru,
        features=[
            Features.Emotion(),
            Features.Keywords(
                emotion=True,
                sentiment=True,
                limit=5
            )
        ]
    )

    output = json.dumps(response,indent=2)
    lines = GetLineStr(output)

    rows = len(lines)
    num = (rows-21)/14

    key = GetKeyword(num,lines)
    anger = GetAnger(num,lines)
    joy = GetJoy(num,lines)
    sadness = GetFear(num,lines)
    fear = GetFear(num,lines)
    disgust = GetDisgust(num,lines)
    emotion = GetEmotion(num,lines)

    sum1 = key + anger + joy + sadness + fear + disgust + emotion

    return (sum1)

aa = "I love tom and bannana"
bb = sentiment_output(aa)
print(bb)
