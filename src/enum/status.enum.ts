export enum StatusEnum {
  // 操作成功
  SUCCESS = 200,
  // 您未登录
  NO_LOGIN_CODE = 401,
  // 重新生成票据
  AGAIN_TOKEN_CODE = 402,
  // 您无权限访问
  NO_PRESSION_CODE = 403,
  // 资源不存在
  NO_SOURCES_CODE = 404,
  // 出现警告
  WARNING = 405,
  // 操作失败
  FAIL = 500
}
