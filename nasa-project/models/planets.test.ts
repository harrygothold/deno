import { assertEquals } from "../test_deps.ts";
import { filterHabitablePlanets } from "./planets.ts";

const HABITABLE_PLANET = {
  "koi_disposition": "CONFIRMED",
  "koi_prad": "1",
  "koi_smass": "1",
  "koi_srad": "1",
};

const TOO_LARGE_PLANETARY_RADIUS = {
  "koi_disposition": "CONFIRMED",
  "koi_prad": "1.5",
  "koi_smass": "1",
  "koi_srad": "1",
};

const TOO_LARGE_SOLAR_RADIUS = {
  "koi_disposition": "CONFIRMED",
  "koi_prad": "1",
  "koi_smass": "1",
  "koi_srad": "1.01",
};

const TOO_LARGE_SOLAR_MASS = {
  "koi_disposition": "CONFIRMED",
  "koi_prad": "1",
  "koi_smass": "1.04",
  "koi_srad": "1",
};

const NOT_CONFIRMED = {
  "koi_disposition": "FALSE POSITIVE",
};

Deno.test("filter only habitable planets", () => {
  const filtered = filterHabitablePlanets([
    HABITABLE_PLANET,
    TOO_LARGE_PLANETARY_RADIUS,
    TOO_LARGE_SOLAR_MASS,
    TOO_LARGE_SOLAR_RADIUS,
    NOT_CONFIRMED,
  ]);
  assertEquals(filtered, [
    HABITABLE_PLANET,
  ]);
});
