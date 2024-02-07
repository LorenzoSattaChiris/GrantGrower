from login import client
from utilities import *
import matplotlib.pyplot as plt

# Fetch the heart rate data using the Garmin Connect API
resting_heart_rate = []

for i in range(0,7):
    resting_heart_rate.append(client.get_heart_rates(getDay(i))["restingHeartRate"])

resting_heart_rate_average = sum(resting_heart_rate) / len(resting_heart_rate)

# Create a list of days to represent the time axis
days = [getDayText(i) for i in range(0,7)]

# Plot the list of numbers as points on the graph
plt.scatter(days, resting_heart_rate, c='red', marker='o')

# Add labels to each point
for day, heart_rate in zip(days, resting_heart_rate):
    # Use the day and heart rate values as the label text
    label = f"({heart_rate})"
    # Annotate the point with the label text
    plt.annotate(label, xy=(day, heart_rate), xytext=(5, 5), textcoords='offset points')

# Add a title and labels to the axes
plt.title("Average Heart Rate Last Week")
plt.xlabel("Day")
plt.ylabel("Heart Rate (bpm)")

# Show the graph
plt.show()

