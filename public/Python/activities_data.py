from login import client
from utilities import *
import matplotlib.pyplot as plt
from datetime import datetime, timedelta

# get_activities(today, limit):
# activities = client.get_activities_by_date(getDay(7), today)

def process_activities(activities):
    processed_activities = []
    activity_count = 0

    for activity in activities:
        if activity.get('activityName') != None and activity.get('distance') != None and activity.get('distance') != 0.0:
            activity_dict = {
                'id': activity.get('activityId'),
                'name': activity.get('activityName'),
                'date': activity.get('startTimeLocal').split(" ", 1)[0],
                'time': activity.get('startTimeLocal').split(" ", 1)[1],
                'averageHR': activity.get('averageHR'),
                'maxHR': activity.get('maxHR'),
                'distance': activity.get('distance'),
                'duration': activity.get('duration'),
                'steps': activity.get('steps'),
                'averageSpeed': activity.get('averageSpeed'),
                'maxSpeed': activity.get('maxSpeed'),
            }
            processed_activities.append(activity_dict)
            activity_count += 1

    return processed_activities, activity_count

activities, activity_count = process_activities(client.get_activities_by_date(getDay(7), today))

def get_last_7_days():
    last_7_days = [(datetime.now() - timedelta(days=i)).date().isoformat() for i in range(7)]
    return last_7_days

def process_activities(activities):
    last_7_days = get_last_7_days()
    activity_dict = {day: 0 for day in last_7_days}

    for activity in activities:
        activity_date = activity.get('startTimeLocal').split(" ", 1)[0]
        if activity_date in last_7_days:
            activity_dict[activity_date] = 1

    return activity_dict

activities = client.get_activities_by_date(getDay(7), today)
activity_dict = process_activities(activities)

print(activity_dict)