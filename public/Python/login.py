import os
import pickle
import time
from garminconnect import (
    Garmin,
    GarminConnectConnectionError,
    GarminConnectTooManyRequestsError,
    GarminConnectAuthenticationError,
)

email = "lsattachiris@gmail.com"
password = "Smilla2011!!!"

# Check if the client object is already stored locally
try:
    with open("Python/garmin_client.pickle", "rb") as file:
        client = pickle.load(file)
except (FileNotFoundError, EOFError):
    client = None

# If client object is not found or it has been more than an hour since the last update, login and store it locally
if client is None or (time.time() - getattr(client, "last_updated", 0)) > 3600:
    try:
        client = Garmin(email, password)
        client.login()
        client.last_updated = time.time()  # Add the 'last_updated' attribute to the client object
        with open("Python/garmin_client.pickle", "wb") as file:
            pickle.dump(client, file)
    except (
        GarminConnectConnectionError,
        GarminConnectAuthenticationError,
        GarminConnectTooManyRequestsError,
    ) as err:
        print(f"Error occurred during Garmin Connect Client init: {err}")
        quit()

print(f"Logged in as {client.get_full_name()}")