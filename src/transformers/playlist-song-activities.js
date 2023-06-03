const listActivity = (data) => ({
  username: data && data.username,
  title: data && data.title,
  action: data && data.action,
  time: data && new Date(data.time).toISOString(),
});

const transformer = {};
transformer.activityList = (datas) => datas.map((data) => listActivity(data));

module.exports = transformer;
