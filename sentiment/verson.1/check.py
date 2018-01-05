from __future__ import print_function
import json
from watson_developer_cloud import NaturalLanguageUnderstandingV1
from watson_developer_cloud.natural_language_understanding_v1 import Features, EntitiesOptions, KeywordsOptions


natural_language_understanding = NaturalLanguageUnderstandingV1(
    version='2017-02-27',
    username='02fb23e9-20d1-47da-bfa8-f380cb1a0bc9',
    password='gk3oevbKk7gD')

def GetLineStr(output):
    alllines = output.split('\n')
    lines=[]
    for oneline in alllines:
        lines.append(oneline)
    return lines


def sentiment_output(shuru):
  response = natural_language_understanding.analyze(
    text=shuru,
      features=Features(
    keywords=KeywordsOptions(
      emotion=False,
      sentiment=True,
      limit=1)))
  output = json.dumps(response,indent=2)
  return output


def judgement(inputstring):
  orignalOutput = sentiment_output(inputstring)
  processed1 = GetLineStr(orignalOutput)
  checkmess = processed1[12]
  if "positive"  in checkmess:
    return True
  if "negative"  in checkmess:
    return False  

  

def word_len(s):
    return len([i for i in s.split(' ') if i])

def inputcheck(inputstring):
  num = word_len(inputstring)
  if (num >= 3):
    result = judgement(inputstring)
    return result
  if (num < 3):
    #print ('no enough input string')
    return True


#a = 'I hate apple'
a = 'I love'
b = inputcheck(a)
if (b==True):
  print('ture')
if (b==False):
  print('false')
if (b==0):
  print('no enough input string')
