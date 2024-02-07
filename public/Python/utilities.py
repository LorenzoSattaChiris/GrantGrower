from datetime import date, timedelta

def getDay(date_distance):
  day = date.today() - timedelta(days=date_distance)
  return day.isoformat()

def getDayText(date_distance):
  day = date.today() - timedelta(days=date_distance)
  return day.strftime("%A")

# Initialize variables for today and yesterday
today = getDay(0)
yesterday = getDay(1)