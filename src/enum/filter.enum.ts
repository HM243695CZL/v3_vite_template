export enum FilterEnum {
  /**
   * 包含
   */
  CONTAINS = 'contains',
  /**
   * 以xx开始
   */
  STARTS_WITH = 'startswith',
  /**
   * 以xx结束
   */
  ENDS_WITH = 'endswith',
  /**
   * 等于
   */
  EQUALS = 'equals',
  /**
   * 在列表中
   */
  IN = 'in',
  /**
   * is null
   */
  ISNULL = 'isnull',
  /**
   * 小于
   */
  LT = 'lt',
  /**
   * 大于
   */
  GT = 'gt',

  /**
   * 大于等于
   */
  GTE = 'gte',

  /**
   * 小于等于
   */
  LTE = 'lte',

  /**
   * 两者之间
   */
  BETWEEN = 'between',
  /**
   * 不等于
   */
  NOTEQ = 'noteq',
  /**
   * 不包含
   */
  NOTIN = 'notin'
}

/**
 * @author leihfei
 * @description 数据匹配类型
 */
export enum FilterTypeEnum {
  AND = 'AND',
  OR = 'OR'
}
