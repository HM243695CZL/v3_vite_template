import {PageEntity} from '/@/domain/page.entity';
import * as _ from 'lodash';
import {FilterEnum} from '/@/enum/filter.enum';

export class PaginationUtils {

  /**
   * 分页条件过滤
   * @param pageDataConfig:当前分页对象
   * @param filterValue:过滤值
   * @param currentValue:当前输入值
   * @param mode：匹配模式
   * @param typeEnum:过滤类型
   */
  public static dealPageChange(pageDataConfig: PageEntity, filterValue: string, currentValue: any, mode: any, typeEnum: any): void {
    (currentValue || currentValue == 0) ? pageDataConfig.filters[filterValue.toString()] = {
      matchMode: mode,
      value: currentValue,
      whereType: typeEnum
    } : delete pageDataConfig.filters[filterValue.toString()];
    // @ts-ignore
    return pageDataConfig;
  }


  /**
   *  处理排序数据
   * @param page 分页对象
   * @param sort 排序对象
   */
  public static sort(page: PageEntity, sort: { key: string; value: string }): PageEntity {
    if (!page) {
      throw new Error('分页数据异常，无法处理排序');
    }
    // 直接对该排序字段进行过滤，如果存在直接删除
    page.multiSortMeta = _.filter(page.multiSortMeta, (el) => el.field !== sort.key);
    // 需要对排序字段进行排序处理，排序value情况有三种，descend=降序 ascend=升序 null=取消排序
    if (sort.value === 'descend') {
      // 降序
      page.multiSortMeta.push({field: sort.key, order: -1});
    } else if (sort.value === 'ascend') {
      // 升序,因为数据库默认升序
      page.multiSortMeta.push({field: sort.key, order: 1});
    } else {
      // sort.value === 'null' 这种情况直接不处理
    }
    return page;
  }


  /**
   *  对过滤属性就行绑定
   * @param page 分页对象
   * @param fieldName 过滤字段名称
   * @param fieldValue 过滤字段值
   * @param matchModes 过滤字段类型，默认为equals,其余可传递： or,and,contails,between
   */
  public static filter(page: PageEntity, fieldName: string, fieldValue: string, matchModes: string = FilterEnum.EQUALS): PageEntity {
    if (fieldValue == null) {
      delete page.filters[fieldName];
      return page;
    }
    if (!page) {
      throw new Error('分页数据异常，无法处理排序');
    }
    // page中，分页条件是下拉列表，那么直接是equals匹配，如果是输入那么是模糊匹配
    Object.keys(page.filters).forEach(item => {
      if (item === fieldName) {
        // 已经有了该过滤的条件值，那么直接删除
        delete page.filters[item];
      }
    });
    // 继续对该过滤属性进行赋值
    page.filters[fieldName] = {
      matchMode: matchModes,
      value: fieldValue
    };
    return page;
  }

  /**
   * @description 对单个数据进行匹配过滤
   * @param value 过滤值
   * @param matchMode 过滤类型
   */
  public static filters(value: any, matchMode: string = FilterEnum.EQUALS): Filters {
    const filters = new Filters();
    filters.value = value;
    filters.matchMode = matchMode;
    return filters;
  }

}

export class Filters {
  public value?: string;
  public matchMode?: string;

  constructor() {
  }
}

