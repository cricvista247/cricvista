export const PreparedStatsData = (data: any) => {
  let modifyData = {
    originalName: data.originalName,
    publicName: data.publicName,
    type: data.type,
  };

  return modifyData;
};
