import axiosRaspberry from "../setup/axiosRaspberry";

const setChannelMonitorDibsys = (data, isShow) => {
  return axiosRaspberry.post(`http://${data.urlRaspberry}:3000/channels/`, {
    secret_key: data.secret_key,
    command: data.command,
    channel_ip: data.channel_ip,
    channel_port: data.channel_port,
    channel_name: data.channel_name,
    show_enable: isShow,
  });
};
const getChannelCurrentMonitor = (ipRaspberry) => {
  return axiosRaspberry.post(
    `http://${ipRaspberry.ipAddress}:3000/channels/get_status`,
    {
      secret_key: "Sctv@123",
    }
  );
};

export { setChannelMonitorDibsys, getChannelCurrentMonitor };
