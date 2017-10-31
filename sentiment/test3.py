import abc
import json
from watson_developer_cloud import NaturalLanguageUnderstandingV1
import watson_developer_cloud.natural_language_understanding.features.v1 \
    as Features

def input():
    strings=""
    strings = raw_input("Please input the target text:\n")
    return strings

def GetMiddleStr(content,startStr,endStr):
  startIndex = content.index(startStr)
  if startIndex>=0:
    startIndex += len(startStr)
  endIndex = content.index(endStr)
  return content[startIndex:endIndex]

natural_language_understanding = NaturalLanguageUnderstandingV1(
    username="3a1f4a06-4cbd-4193-81e7-a698805aef3e",
    password="BGIu8SBYwgB3",
    version="2017-02-27")

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

output = json.dumps(response, indent=2)
print(output)
print output.count("text")
