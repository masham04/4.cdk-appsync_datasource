type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    msg: string;
  };
};

exports.handler = async (event: AppSyncEvent) => {
  if (event.info.fieldName === "hello") {
    return "Hello World";
  } else if (event.info.fieldName === "myCustomMessage") {
    return `This is custom message ${event.arguments.msg}`;
  } else {
    return "No data";
  }
};
