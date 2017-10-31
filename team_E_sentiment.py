from xlrd import open_workbook
from xlutils.copy import copy
import json
from watson_developer_cloud import NaturalLanguageUnderstandingV1
import watson_developer_cloud.natural_language_understanding.features.v1 \
  as Features

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

def GetKeyword(num):
    key = []
    if num != 5:
        for i in range(1,num+1):
            a = GetMiddleStr(lines[9 + (i - 1) * 14], '"text": "', '", ')
            key.append(a)
        for k in range(num+1,5+1):
            b = "No data"
            key.append(b)
    if num == 5:
        for j in range(1,num+1):
            a = GetMiddleStr(lines[9 + (j - 1) * 14], '"text": "', '", ')
            key.append(a)
    return key

def GetAnger(num):
    anger = []
    if num != 5:
        for i in range(1,num+1):
            a = GetMiddleStr(lines[11 + (i - 1) * 14], '"anger": ', ', ')
            anger.append(a)
        for k in range(num+1,5+1):
            b = "No data"
            anger.append(b)
    if num == 5:
        for j in range(1,num+1):
            a = GetMiddleStr(lines[11 + (j - 1) * 14], '"anger": ', ', ')
            anger.append(a)
    return anger

def GetJoy(num):
    joy = []
    if num != 5:
        for i in range(1,num+1):
            a = GetMiddleStr(lines[12 + (i - 1) * 14], '"joy": ', ', ')
            joy.append(a)
        for k in range(num+1,5+1):
            b = "No data"
            joy.append(b)
    if num == 5:
        for j in range(1,num+1):
            a = GetMiddleStr(lines[12 + (j - 1) * 14], '"joy": ', ', ')
            joy.append(a)
    return joy

def GetSadness(num):
    sadness = []
    if num != 5:
        for i in range(1,num+1):
            a = GetMiddleStr(lines[13 + (i - 1) * 14], '"sadness": ', ', ')
            sadness.append(a)
        for k in range(num+1,5+1):
            b = "No data"
            sadness.append(b)
    if num == 5:
        for j in range(1,num+1):
            a = GetMiddleStr(lines[13 + (j - 1) * 14], '"sadness": ', ', ')
            sadness.append(a)
    return sadness

def GetFear(num):
    fear = []
    if num != 5:
        for i in range(1,num+1):
            a = GetMiddleStr(lines[14 + (i - 1) * 14], '"fear": ', ', ')
            fear.append(a)
        for k in range(num+1,5+1):
            b = "No data"
            fear.append(b)
    if num == 5:
        for j in range(1,num+1):
            a = GetMiddleStr(lines[14 + (j - 1) * 14], '"fear": ', ', ')
            fear.append(a)
    return fear

def GetDisgust(num):
    disgust = []
    if num != 5:
        for i in range(1,num+1):
            c = lines[15 + (i - 1) * 14] + lines[16 + (i - 1) * 14]
            a = GetMiddleStr(c, '"disgust": ', '      }, ')
            disgust.append(a)
        for k in range(num+1,5+1):
            b = "No data"
            disgust.append(b)
    if num == 5:
        for j in range(1,num+1):
            c = lines[15 + (j - 1) * 14] + lines[16 + (j - 1) * 14]
            a = GetMiddleStr(c, '"disgust": ', '      }, ')
            disgust.append(a)
    return disgust

def GetEmotion(num):
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

natural_language_understanding = NaturalLanguageUnderstandingV1(
  username="3a1f4a06-4cbd-4193-81e7-a698805aef3e",
  password="BGIu8SBYwgB3",
  version="2017-02-27"
)

response = natural_language_understanding.analyze(
  text=input(),
  features=[
      Features.Emotion(),
      Features.Keywords(
      emotion=True,
      sentiment=True,
      limit=5
    )
  ]
)

output=json.dumps(response, indent=2)
lines = GetLineStr(output)

rows = len(lines)
num = (rows-21)/14

key = GetKeyword(num)
anger = GetAnger(num)
joy = GetJoy(num)
sadness = GetSadness(num)
fear = GetFear(num)
disgust = GetDisgust(num)
emotion = GetEmotion(num)

print(key)
print(anger)
print(joy)
print(sadness)
print(fear)
print(disgust)
print(emotion)



outputToText(key)
outputToText(anger)
outputToText(joy)
outputToText(sadness)
outputToText(fear)
outputToText(disgust)
outputToText(emotion)