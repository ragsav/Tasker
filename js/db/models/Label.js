import {Model} from '@nozbe/watermelondb';
import {
  field,
  text,
  relation,
  children,
  writer,
  date,
  readonly,
} from '@nozbe/watermelondb/decorators';

export default class Label extends Model {
  static table = 'labels';

  static associations = {
    notes: {type: 'has_many', foreignKey: 'label_id'},
  };

  @text('title') title;
  @text('icon_string') iconString;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  @children('notes') notes;
}
