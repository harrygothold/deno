import { flatMap, log } from "../deps.ts";

interface Launch {
  flightNumber: number;
  mission: string;
  rocket: string;
  customers: Array<String>;
  launchDate: number;
  upcoming: boolean;
  success?: boolean;
  target?: string;
}

const launches = new Map<number, Launch>();

export const downloadLaunchData = async () => {
  log.info("Downloading Launch Data...");
  const response = await fetch(
    "https://api.spacexdata.com/v3/launches",
  );
  if (!response.ok) {
    log.warning("Problem downloading launch data");
    throw new Error("Launch Data Download Failed");
  }
  const launchData = await response.json();
  for (const launch of launchData) {
    const payloads = launch["rocket"]["second_stage"]["payloads"];
    const customers = flatMap(payloads, (payload: any) => {
      return payload["customers"];
    });
    const flightData = {
      flightNumber: launch["flight_number"],
      mission: launch["mission_name"],
      rocket: launch["rocket"]["rocket_name"],
      launchDate: launch["launch_date_unix"],
      upcoming: launch["upcoming"],
      success: launch["launch_success"],
      customers,
    };
    launches.set(flightData.flightNumber, flightData);
    log.info(JSON.stringify(flightData));
  }
};

await downloadLaunchData();
log.info(`Downloaded data for ${launches.size} SpaceX launches `);

export const getAll = () => {
  return Array.from(launches.values());
};

export const getOne = (id: number) => {
  if (launches.has(id)) {
    return launches.get(id);
  }
  return null;
};

export const addOne = (data: Launch) => {
  launches.set(
    data.flightNumber,
    Object.assign(data, {
      upcoming: true,
      customers: ["Zero to Mastery", "NASA"],
    }),
  );
};

export const removeOne = (id: number) => {
  const aborted = launches.get(id);
  if (aborted) {
    aborted.upcoming = false;
    aborted.success = false;
  }
  return aborted;
};
