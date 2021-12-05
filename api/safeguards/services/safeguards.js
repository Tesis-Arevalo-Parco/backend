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
};

const buildSafeguardData = (safeguards) => {
  const threatsListWithSafeguard = [];
  safeguards?.forEach((safeguard) => {
    return safeguard?.treath_list?.forEach((threat) => {
      const isThreatInList = threatsListWithSafeguard?.findIndex(
        (threatInList) => threatInList?.key === threat?.treath_code
      );
      if (isThreatInList === -1) {
        threatsListWithSafeguard.push({
          key: threat.treath_code,
          ei: safeguard.effectiveness_against_impact,
          ef: safeguard.effectiveness_against_probability,
        });
      } else {
        const threatInList = threatsListWithSafeguard[isThreatInList];
        threatInList.ei =
          (safeguard.effectiveness_against_impact + threatInList.ei) / 2;
        threatInList.ef =
          (safeguard.effectiveness_against_probability + threatInList.ef) / 2;
      }
    });
  });
  return threatsListWithSafeguard;
};
const valueData = (threat, key, valueKey, safeguardsData) => {
  const isThreatInList = safeguardsData?.find(
    (threatInList) => threatInList?.key === key
  );
  const threatDataF = threat[valueKey]?.find((item) => item?.keyValue === key);
  if (isThreatInList && valueKey !== DATA_ASSETS_VALUE.probability.value) {
    const ei = isThreatInList?.ei / 100;
    const partialValue = threatDataF?.value * ei;
    const result = Math.abs(threatDataF?.value) - Math.abs(partialValue);
    return Math.abs(result) > 0 ? Math.abs(result).toFixed(2) : 0;
  } else if (
    isThreatInList &&
    valueKey === DATA_ASSETS_VALUE.probability.value
  ) {
    const ef = isThreatInList?.ef;
    const partialValue = Math.abs(threatDataF?.value * ef);
    const result = Math.abs(threatDataF?.value) - Math.abs(partialValue);
    return Math.abs(result) > 0 ? Math.abs(result).toFixed(2) : 0;
  }
  return threatDataF?.value || 0;
};
