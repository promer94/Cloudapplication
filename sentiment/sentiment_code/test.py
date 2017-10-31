import json
from watson_developer_cloud import NaturalLanguageUnderstandingV1
import watson_developer_cloud.natural_language_understanding.features.v1 \
  as Features

natural_language_understanding = NaturalLanguageUnderstandingV1(
  username="3a1f4a06-4cbd-4193-81e7-a698805aef3e",
  password="BGIu8SBYwgB3",
  version="2017-02-27")

response = natural_language_understanding.analyze(
  text="I love apple! but I don't like oranges",
  features=[
    Features.Entities(
      emotion=True,
      sentiment=True,
      limit=2
    ),
    Features.Keywords(
      emotion=True,
      sentiment=True,
      limit=2
    )
  ]
)

print(json.dumps(response, indent=2))