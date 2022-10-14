export class PageEntity {
  /**
   * 第几页，主要因为前段必须带的是页数，而不是记录开始数，所以设置为1,
   */
  first = 1;
  /**
   * 行数
   */
  rows = 10;
  /**
   * 总记录数
   */
  totalRecords = 1;

  /**
   * 全局排序，默认为1，跟数据库匹配，默认为升序
   * asc升序=1
   * desc降序=-1
   */
  sortOrder = -1;

  /**
   * 过滤参数
   * filters:{
   *     name:{
   *         value:'雷洪飞',
   *         matchMode:'contains/equals/between...'
   *     }
   * }
   */
  filters: any = {};

  /**
   * 多字段排序
   */
  multiSortMeta: Array<SortMeta> = [];
}

class SortMeta {
  field?: string;
  order = 1;
}

/**
 *
 *  分页写法
 *  html文件中
 *     <span>共有{{this.pageInfo.totalRecords}}条，每页：{{this.pageInfo.rows}}条</span>
 * <nz-pagination [nzPageIndex]="this.pageInfo.pagNum" [nzTotal]="this.pageInfo.totalRecords" nzShowSizeChanger
 * [nzPageSize]="10"
 * (nzPageIndexChange)=" this.pageInfo.pagNum = $event;this.page(this.pageInfo)"
 * (nzPageSizeChange)="this.pageInfo.rows = $event;this.page(this.pageInfo)"
 * ></nz-pagination>
 *
 *   ts文件汇总
 * pageInfo: PageEntity = new PageEntity();
 *
 *
 */
