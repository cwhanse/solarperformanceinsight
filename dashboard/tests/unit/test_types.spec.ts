import { shallowMount } from "@vue/test-utils";
import { System } from "@/types/System";
import { Inverter } from "@/types/Inverter";
import { PVArray } from "@/types/PVArray";
import {
  PVSystInverterParameters,
  PVWattsInverterParameters
} from "@/types/InverterParameters";
import {
  PVSystModuleParameters,
  PVWattsModuleParameters
} from "@/types/ModuleParameters";
import {
  FixedTrackingParameters,
  SingleAxisTrackingParameters
} from "@/types/Tracking";
import {
  PVSystTemperatureParameters,
  PVWattsTemperatureParameters
} from "@/types/TemperatureParameters";

test("Instantiate base system", () => {
  const system = new System({});
  expect(system instanceof System).toBeTruthy();
  const inverters = system.inverters;
  expect(inverters instanceof Array).toBeTruthy();
  expect(inverters.length).toBe(0);
});

const pvsyst_test_system = {
  name: "Test System",
  latitude: 0,
  longitude: 0,
  elevation: 0,
  albedo: 0,
  inverters: [
    {
      name: "New Inverter",
      make_model: "ABC 520",
      inverter_parameters: {
        Paco: 0,
        Pdco: 0,
        Vdco: 0,
        Pso: 0,
        C0: 0,
        C1: 0,
        C2: 0,
        C3: 0,
        Pnt: 0
      },
      losses_parameters: {},
      arrays: [
        {
          name: "New Array",
          make_model: "ABC 123",
          modules_per_string: 0,
          strings: 0,
          losses_parameters: {},
          module_parameters: {
            gamma_ref: 0,
            mu_gamma: 0,
            I_L_ref: 0,
            I_o_ref: 0,
            R_sh_ref: 0,
            R_sh_0: 0,
            R_s: 0,
            alpha_sc: 0,
            EgRef: 0,
            cells_in_series: 0
          },
          tracking: {
            tilt: 0,
            azimuth: 0
          },
          temperature_model_parameters: {
            uC: 29,
            uV: 0
          }
        }
      ]
    }
  ]
};
test("Instantiate pvsyst system from object", () => {
  expect(System.isInstance(pvsyst_test_system)).toBeTruthy();
  const system: System = new System(pvsyst_test_system);
  expect(system instanceof System).toBeTruthy();
  const inverters = system.inverters;
  expect(inverters instanceof Array).toBeTruthy();
  for (let i = 0; i < inverters.length; i++) {
    const inverter = inverters[i];
    expect(inverter instanceof Inverter).toBeTruthy();
    expect(
      inverter.inverter_parameters instanceof PVSystInverterParameters
    ).toBeTruthy();
    expect(typeof inverter.make_model).toBe("string");
    const arrays = inverter.arrays;
    expect(arrays instanceof Array).toBeTruthy();
    for (let i = 0; i < arrays.length; i++) {
      const array = arrays[i];
      expect(array instanceof PVArray).toBeTruthy();
      expect(
        array.module_parameters instanceof PVSystModuleParameters
      ).toBeTruthy();
      expect(array.tracking instanceof FixedTrackingParameters).toBeTruthy();
      expect(
        array.temperature_model_parameters instanceof
          PVSystTemperatureParameters
      ).toBeTruthy();
    }
  }
});

const pvwatts_test_system = {
  name: "Big test system",
  latitude: 34.0,
  longitude: -110.0,
  elevation: 500,
  albedo: 0.2,
  inverters: [
    {
      name: "The inverter",
      make_model: "Inverter 5000",
      inverter_parameters: {
        pdc: 1.0,
        pdc0: 1.0,
        eta_inv_nom: 0.96,
        eta_inv_ref: 0.9637
      },
      losses_parameters: {},
      arrays: [
        {
          name: "The Array",
          make_model: "ABC 123",
          modules_per_string: 0,
          strings: 0,
          losses_parameters: {},
          module_parameters: {
            pdc0: 1.0,
            gamma_pdc: 1.0
          },
          tracking: {
            tilt: 30.0,
            azimuth: 180.0
          },
          temperature_model_parameters: {
            a: 1.0,
            b: 1.0,
            deltaT: 0.5
          }
        }
      ]
    }
  ]
};

test("Instantiate pvwatts system from object", () => {
  expect(System.isInstance(pvwatts_test_system)).toBeTruthy();
  const system: System = new System(pvwatts_test_system);
  expect(system instanceof System).toBeTruthy();
  const inverters = system.inverters;
  expect(inverters instanceof Array).toBeTruthy();
  for (let i = 0; i < inverters.length; i++) {
    const inverter = inverters[i];
    expect(inverter instanceof Inverter).toBeTruthy();
    expect(typeof inverter.make_model).toBe("string");
    const arrays = inverter.arrays;
    expect(arrays instanceof Array).toBeTruthy();
    for (let i = 0; i < arrays.length; i++) {
      const array = arrays[i];
      expect(array instanceof PVArray).toBeTruthy();
      expect(
        array.module_parameters instanceof PVWattsModuleParameters
      ).toBeTruthy();
      expect(array.tracking instanceof FixedTrackingParameters).toBeTruthy();
      expect(
        array.temperature_model_parameters instanceof
          PVWattsTemperatureParameters
      ).toBeTruthy();
    }
  }
});

test("PVArray Instance", () => {
  const array: PVArray = new PVArray(
    pvsyst_test_system["inverters"][0]["arrays"][0]
  );
});

test("Inverter Instance", () => {
  const inverter: Inverter = new Inverter(pvsyst_test_system["inverters"][0]);
});

test("Instantiate fixed tracking", () => {
  const tracking_params = {
    tilt: 30.0,
    azimuth: 180.0
  };
  const tracking = new FixedTrackingParameters(tracking_params);
  expect(tracking instanceof FixedTrackingParameters).toBeTruthy();
  expect(tracking.tilt).toBe(30.0);
  expect(tracking.azimuth).toBe(180.0);
  expect(FixedTrackingParameters.isInstance(tracking_params)).toBeTruthy();
});

test("Instantiate Single Axis tracking", () => {
  const tracking_params = {
    axis_tilt: 30.0,
    axis_azimuth: 180.0,
    gcr: 0.5
  };
  const tracking = new SingleAxisTrackingParameters(tracking_params);
  expect(tracking instanceof SingleAxisTrackingParameters).toBeTruthy();
  expect(tracking.axis_tilt).toBe(30.0);
  expect(tracking.axis_azimuth).toBe(180.0);
  expect(tracking.gcr).toBe(0.5);

  expect(SingleAxisTrackingParameters.isInstance(tracking_params)).toBeTruthy();
});

test("Empty Inverter init", () => {
  const inverter = new Inverter({});
  expect(inverter.name).toBe("New Inverter");
  expect(inverter.make_model).toBe("ABC 520");
  expect(inverter.inverter_parameters instanceof PVSystInverterParameters);
  expect(inverter.losses_parameters).toStrictEqual({});
  expect(inverter.arrays).toStrictEqual([]);
});

test("Empty pvwatts inverter parameters init", () => {
  const ip = new PVWattsInverterParameters({});
  expect(ip.pdc).toBe(0);
  expect(ip.pdc0).toBe(0);
  expect(ip.eta_inv_nom).toBe(0.96);
  expect(ip.eta_inv_ref).toBe(0.9637);
});

test("Empty pvsyst inverter parameters init", () => {
  const ip = new PVSystInverterParameters({});
  expect(ip.Paco).toBe(0);
  expect(ip.Pdco).toBe(0);
  expect(ip.Vdco).toBe(0);
  expect(ip.Pso).toBe(0);
  expect(ip.C0).toBe(0);
  expect(ip.C1).toBe(0);
  expect(ip.C2).toBe(0);
  expect(ip.Pnt).toBe(0);
});
describe("Array typeguard", () => {
  test.each([
    "name",
    "make_model",
    "module_parameters",
    "temperature_model_parameters",
    "tracking",
    "modules_per_string",
    "strings",
    "losses_parameters"
  ])("Array typeguard missing %p", missing => {
    const anon_array: { [key: string]: any } = {
      name: "New Array",
      make_model: "ABC 123",
      modules_per_string: 0,
      strings: 0,
      losses_parameters: {},
      module_parameters: {
        gamma_ref: 0,
        mu_gamma: 0,
        I_L_ref: 0,
        I_o_ref: 0,
        R_sh_ref: 0,
        R_sh_0: 0,
        R_s: 0,
        alpha_sc: 0,
        EgRef: 0,
        cells_in_series: 0
      },
      tracking: {
        tilt: 0,
        azimuth: 0
      },
      temperature_model_parameters: {
        uC: 29,
        uV: 0
      }
    };
    anon_array[missing] = undefined;
    expect(PVArray.isInstance(anon_array)).toBeFalsy();
  });
});
describe("Inverter typeguard", () => {
  test.each([
    "name",
    "make_model",
    "inverter_parameters",
    "losses_parameters",
    "arrays"
  ])("Inverter typeguard missing %p", missing => {
    const anon_inv: { [key: string]: any } = {
      name: "name",
      make_model: "mk_model",
      inverter_parameters: {},
      losses_parameters: {},
      arrays: []
    };
    anon_inv[missing] = undefined;
    expect(Inverter.isInstance(anon_inv)).toBeFalsy();
  });
});

describe("PVSyst inverter parameters typeguard", () => {
  test.each(["Paco", "Pdco", "Vdco", "Pso", "C0", "C1", "C2", "C3", "Pnt"])(
    "pvsyst ip typeguard missing %p",
    missing => {
      const anon_params: { [key: string]: any } = {
        Paco: 0,
        Pdco: 0,
        Vdco: 0,
        Pso: 0,
        C0: 0,
        C1: 0,
        C2: 0,
        C3: 0,
        Pnt: 0
      };
      anon_params[missing] = undefined;
      expect(PVSystInverterParameters.isInstance(anon_params)).toBeFalsy();
    }
  );
});

describe("PVWatts inverter parameters typeguard", () => {
  test.each(["pdc", "pdc0", "eta_inv_nom", "eta_inv_ref"])(
    "pvwatts ip typeguard missing %p",
    missing => {
      const anon_params: { [key: string]: any } = {
        pdc: 0,
        pdc0: 0,
        eta_inv_nom: 0,
        eta_inv_ref: 0
      };
      anon_params[missing] = undefined;
      expect(PVSystInverterParameters.isInstance(anon_params)).toBeFalsy();
    }
  );
});
describe("PVSyst module parameters typeguard", () => {
  test.each([
    "gamma_ref",
    "mu_gamma",
    "I_L_ref",
    "I_o_ref",
    "R_sh_ref",
    "R_sh_0",
    "R_s",
    "alpha_sc",
    "EgRef",
    "cells_in_series"
  ])("pvwatts mp typeguard missing %p", missing => {
    const anon_params: { [key: string]: any } = {
      gamma_ref: 0,
      mu_gamma: 0,
      I_L_ref: 0,
      I_o_ref: 0,
      R_sh_ref: 0,
      R_sh_0: 0,
      R_s: 0,
      alpha_sc: 0,
      EgRef: 0,
      cells_in_series: 0
    };
    anon_params[missing] = undefined;
    expect(PVSystModuleParameters.isInstance(anon_params)).toBeFalsy();
  });
});
describe("PVWatts module parameters typeguard", () => {
  test.each(["pdc0", "gamma_pdc"])(
    "pvwatts mp typeguard missing %p",
    missing => {
      const anon_params: { [key: string]: any } = {
        pdc0: 0,
        gamma_pdc: 0
      };
      anon_params[missing] = undefined;
      expect(PVWattsInverterParameters.isInstance(anon_params)).toBeFalsy();
    }
  );
});
test("Empty pvsyst module parameters init", () => {
  const mp = new PVSystModuleParameters({});
  expect(mp.gamma_ref).toBe(0);
  expect(mp.mu_gamma).toBe(0);
  expect(mp.I_L_ref).toBe(0);
  expect(mp.I_o_ref).toBe(0);
  expect(mp.R_sh_ref).toBe(0);
  expect(mp.R_sh_0).toBe(0);
  expect(mp.R_s).toBe(0);
  expect(mp.alpha_sc).toBe(0);
  expect(mp.EgRef).toBe(0);
  expect(mp.cells_in_series).toBe(0);
});

test("Empty pvwatts module parameters init", () => {
  const mp = new PVWattsModuleParameters({});
  expect(mp.pdc0).toBe(0);
  expect(mp.gamma_pdc).toBe(0);
});

test("Empty pvarray init", () => {
  const pvarray = new PVArray({});
  expect(pvarray.name).toBe("New Array");
  expect(pvarray.make_model).toBe("ABC 123");
  expect(
    pvarray.module_parameters instanceof PVSystModuleParameters
  ).toBeTruthy();
  expect(pvarray.tracking instanceof FixedTrackingParameters).toBeTruthy();
  expect(
    pvarray.temperature_model_parameters instanceof PVSystTemperatureParameters
  ).toBeTruthy();
  expect(pvarray.modules_per_string).toBe(0);
  expect(pvarray.strings).toBe(0);
  expect(pvarray.losses_parameters).toStrictEqual({});
});
test("PVWatts array init", () => {
  const array = new PVArray({});
  array.module_parameters = new PVWattsModuleParameters({});
  array.temperature_model_parameters = new PVWattsTemperatureParameters({});
  array.tracking = new SingleAxisTrackingParameters({});

  const pvwattsArray = new PVArray(array);
  expect(pvwattsArray.name).toBe("New Array");
  expect(pvwattsArray.make_model).toBe("ABC 123");
  expect(
    pvwattsArray.module_parameters instanceof PVWattsModuleParameters
  ).toBeTruthy();
  expect(
    pvwattsArray.tracking instanceof SingleAxisTrackingParameters
  ).toBeTruthy();
  expect(
    pvwattsArray.temperature_model_parameters instanceof
      PVWattsTemperatureParameters
  ).toBeTruthy();
  expect(pvwattsArray.modules_per_string).toBe(0);
  expect(pvwattsArray.strings).toBe(0);
  expect(pvwattsArray.losses_parameters).toStrictEqual({});
});
test("PVarray init with array temperature", () => {
  const pvarray = new PVArray({ temperature_model_parameters: [1, 2, 3] });
  expect(pvarray.temperature_model_parameters).toStrictEqual([1, 2, 3]);
});
