"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */
const DATA_ASSETS_VALUE = {
  availability: {
    value: "availability",
    label: "[D] Disponibilidad",
  },
  integrity: { value: "integrity", label: "[I] Integridad" },
  confidentiality: { value: "confidentiality", label: "[C] Confidencialidad" },
  authenticity: { value: "authenticity", label: "[A] Autenticidad" },
  traceability: { value: "traceability", label: "[T] Trazabilidad" },
  probability: { value: "probability", label: "[P] Probabilidad" },
};

const matrizImpacto = [
  ["M", "B", "MB", "MB", "MB"],
  ["A", "M", "B", "MB", "MB"],
  ["MA", "A", "M", "B", "MB"],
];

const matrizRiesgo = [
  ["A", "M", "B", "MB", "MB"],
  ["MA", "A", "M", "B", "MB"],
  ["MA", "A", "M", "B", "MB"],
  ["MA", "MA", "A", "M", "B"],
  ["MA", "MA", "A", "M", "B"],
];

module.exports = {
  async findSafeguardThreats(projectId) {
    const project = await strapi.services.projects.findOne(
      {
        id: projectId,
      },
      [
        {
          path: "assets",
          populate: {
            path: "threat",
          },
        },
        {
          path: "dependency",
        },
        {
          path: "safeguards",
        },
      ]
    );
    const safeguardsData = buildSafeguardData(project.safeguards);
    const data = project.assets.map((asset) => {
      const { threat } = asset;
      const fullData = threat?.threats?.map((threatData) => ({
        key: threatData?.key,
        name: threatData?.title,
        availability: valueData(
          threat,
          threatData?.key,
          DATA_ASSETS_VALUE.availability.value,
          safeguardsData
        ),
        integrity: valueData(
          threat,
          threatData?.key,
          DATA_ASSETS_VALUE.integrity.value,
          safeguardsData
        ),
        confidentiality: valueData(
          threat,
          threatData?.key,
          DATA_ASSETS_VALUE.confidentiality.value,
          safeguardsData
        ),
        authenticity: valueData(
          threat,
          threatData?.key,
          DATA_ASSETS_VALUE.authenticity.value,
          safeguardsData
        ),
        traceability: valueData(
          threat,
          threatData?.key,
          DATA_ASSETS_VALUE.traceability.value,
          safeguardsData
        ),
        probability: valueData(
          threat,
          threatData?.key,
          DATA_ASSETS_VALUE.probability.value,
          safeguardsData
        ),
        vulnerability: threat?.vulnerabilities,
        threatId: threat?.id,
        dimensions: threatData?.dimensions,
      }));
      return {
        assetId: asset._id,
        identification: asset.identification,
        name: asset.name,
        model: asset.model,
        data: fullData,
      };
    });
    return data;
  },
  async findSafeguardThreatsRisk(projectId) {
    const project = await strapi.services.projects.findOne(
      {
        id: projectId,
      },
      [
        {
          path: "assets",
          populate: {
            path: "threat",
          },
        },
        {
          path: "dependency",
        },
        {
          path: "safeguards",
        },
      ]
    );
    const safeguardsData = buildSafeguardData(project.safeguards);
    const data = project.assets.map((asset) => {
      const { threat } = asset;
      const fullData = threat?.threats?.map((threatData) => ({
        key: threatData?.key,
        name: threatData?.title,
        availability: valueDataWithSafeguards(
          threat,
          threatData?.key,
          DATA_ASSETS_VALUE.availability.value,
          safeguardsData,
          asset
        ),
        integrity: valueDataWithSafeguards(
          threat,
          threatData?.key,
          DATA_ASSETS_VALUE.integrity.value,
          safeguardsData,
          asset
        ),
        confidentiality: valueDataWithSafeguards(
          threat,
          threatData?.key,
          DATA_ASSETS_VALUE.confidentiality.value,
          safeguardsData,
          asset
        ),
        authenticity: valueDataWithSafeguards(
          threat,
          threatData?.key,
          DATA_ASSETS_VALUE.authenticity.value,
          safeguardsData,
          asset
        ),
        traceability: valueDataWithSafeguards(
          threat,
          threatData?.key,
          DATA_ASSETS_VALUE.traceability.value,
          safeguardsData,
          asset
        ),
        vulnerability: threat?.vulnerabilities,
        threatId: threat?.id,
        dimensions: threatData?.dimensions,
      }));
      return {
        assetId: asset._id,
        identification: asset.identification,
        name: asset.name,
        model: asset.model,
        data: fullData,
      };
    });
    return data;
  },
};

const buildSafeguardData = (safeguards) => {
  const threatsListWithSafeguard = [];
  const tempList = [];
  safeguards.forEach((safeguard) => {
    safeguard?.treath_list?.forEach((threat) => {
      const findValue = tempList?.findIndex((item) => item.key === threat?.treath_code)
      if(findValue !== -1){
        tempList[findValue].ei.push(safeguard?.effectiveness_against_impact);
        tempList[findValue].ef.push(safeguard?.effectiveness_against_probability);
      }else {
        tempList.push({
          key: threat?.treath_code,
          name: threat?.treath_name,
          ei: [safeguard?.effectiveness_against_impact],
          ef: [safeguard?.effectiveness_against_probability],
        });
      }
    })
  })
  tempList?.forEach((threat) => {
    const effectiveness_against_impact = threat?.ei?.reduce((a, b) => a + b, 0) / threat?.ei?.length;
    const effectiveness_against_probability = threat?.ef?.reduce((a, b) => a + b, 0) / threat?.ef?.length;
    threatsListWithSafeguard.push({
      key: threat?.key,
      name: threat?.name,
      ei: effectiveness_against_impact,
      ef: effectiveness_against_probability,
    });
  })

  return threatsListWithSafeguard;
};

const valueData = (threat, key, valueKey, safeguardsData) => {
  const isThreatInList = safeguardsData?.find(
    (threatInList) => threatInList?.key === key
  );
  const threatDataF = threat[valueKey]?.find((item) => item?.keyValue === key);
  if (isThreatInList && valueKey !== DATA_ASSETS_VALUE.probability.value) {
    const ei = (isThreatInList?.ei / 100).toFixed(2);
    const partialValue = threatDataF?.value * ei;
    const result = Math.abs(threatDataF?.value) - Math.abs(partialValue);
    return Math.abs(result) > 0 ? Math.abs(result).toFixed(2) : "";
  } else if (
    isThreatInList &&
    valueKey === DATA_ASSETS_VALUE.probability.value
  ) {
    console.log(isThreatInList?.ef,threatDataF?.value);
    const ef = (isThreatInList?.ef / 100).toFixed(2);
    const partialValue = Math.abs(threatDataF?.value * ef);
    const result = Math.abs(threatDataF?.value) - Math.abs(partialValue);
    return Math.abs(result) > 0 ? Math.abs(result).toFixed(2) : "";
  }
  return threatDataF?.value || "";
};

const calculoImpacto = (valorActivo, valorDegradacion) => {
  let valorX = -1;
  let valorY = -1;

  if (valorDegradacion >= 80 && valorDegradacion <= 100) {
    valorX = 2;
  } else if (valorDegradacion >= 30 && valorDegradacion <= 79) {
    valorX = 1;
  } else if (valorDegradacion >= 0 && valorDegradacion <= 29) {
    valorX = 0;
  }

  if (valorActivo === 10) {
    valorY = 0;
  } else if (valorActivo >= 7 && valorActivo <= 9.9) {
    valorY = 1;
  } else if (valorActivo >= 4 && valorActivo <= 6.9) {
    valorY = 2;
  } else if (valorActivo >= 1 && valorActivo <= 3.9) {
    valorY = 3;
  } else if (valorActivo >= 0 && valorActivo <= 0.9) {
    valorY = 4;
  }
  const result = matrizImpacto[valorX][valorY];
  return result;
};

const valueDataWithSafeguards = (
  threat,
  key,
  valueKey,
  safeguardsData,
  data
) => {
  const threatDataF = valueData(threat, key, valueKey, safeguardsData);
  const assetValueA = data[DATA_ASSETS_VALUE.availability.value];
  const assetValueI = data[DATA_ASSETS_VALUE.integrity.value];
  const assetValueC = data[DATA_ASSETS_VALUE.confidentiality.value];
  const assetValueAU = data[DATA_ASSETS_VALUE.authenticity.value];
  const assetValueT = data[DATA_ASSETS_VALUE.traceability.value];
  if (
    valueKey === DATA_ASSETS_VALUE.availability.value &&
    threatDataF &&
    assetValueA?.value
  ) {
    return calculoImpacto(+assetValueA.value, +threatDataF);
  } else if (
    valueKey === DATA_ASSETS_VALUE.integrity.value &&
    threatDataF &&
    assetValueI?.value
  ) {
    return calculoImpacto(+assetValueI.value, +threatDataF);
  } else if (
    valueKey === DATA_ASSETS_VALUE.confidentiality.value &&
    threatDataF &&
    assetValueC?.value
  ) {
    return calculoImpacto(+assetValueC.value, +threatDataF);
  } else if (
    valueKey === DATA_ASSETS_VALUE.authenticity.value &&
    threatDataF &&
    assetValueAU?.value
  ) {
    return calculoImpacto(+assetValueAU.value, +threatDataF);
  } else if (
    valueKey === DATA_ASSETS_VALUE.traceability.value &&
    threatDataF &&
    assetValueT?.value
  ) {
    return calculoImpacto(+assetValueT.value, +threatDataF);
  } else {
    return "";
  }
};

const calculoRiesgo = (valoProbabilidad, valorImpacto) => {
  let valorX = -1
  let valorY = -1

  if (valoProbabilidad === 'MB') {
    valorX = 0
  } else if (valoProbabilidad === 'B') {
    valorX = 1
  } else if (valoProbabilidad === 'M') {
    valorX = 2
  } else if (valoProbabilidad === 'A') {
    valorX = 3
  } else if (valoProbabilidad === 'MA') {
    valorX = 4
  }

  if (valorImpacto === 'MA') {
    valorY = 0
  } else if (valorImpacto === 'A') {
    valorY = 1
  } else if (valorImpacto === 'M') {
    valorY = 2
  } else if (valorImpacto === 'B') {
    valorY = 3
  } else if (valorImpacto === 'MB') {
    valorY = 4
  }
  const result = matrizRiesgo[valorX][valorY]
  return result
}