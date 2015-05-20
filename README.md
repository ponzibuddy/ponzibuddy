# PonziBUDDY

PonziBUDDY predicts FX rates!

[Deployed app](http://ponzibuddy.herokuapp.com/)

## JSON endpoints

* [/api/history](http://ponzibuddy.herokuapp.com/api/history?since=2014&until=2015)
  - Historical daily rates since 1999
  - GET parameters: since (optional), until (optional)
* [/api/latest](http://ponzibuddy.herokuapp.com/api/latest)
  - Latest rate
* [/api/predict](http://ponzibuddy.herokuapp.com/api/predict)
  - Prediction for the next unknown date (tomorrow)
