import { useMemberForm } from './hooks/useMemberForm';
import { levelOptions } from '../../constants/levelOptions';
import { sexOptions } from '../../constants/sexOptions';
import Button from '@/components/Button';
import RadioGroup from '@/components/RadioGroup';
import Textarea from '@/components/Textarea';
import Textbox from '@/components/Textbox';

import type { SubmitHandler } from './hooks/useMemberForm';

import styles from './index.module.scss';

const NewMemberForm = () => {
  const { fieldValues, handleSubmit, errors } = useMemberForm();

  const onSubmit: SubmitHandler = (data) => {
    // todo: implement logic to submit form data.
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.module}>
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          名前（必須）
        </label>
        <Textbox id="name" {...filedValues.name} />
        {errors.name && (
          <div role="alert" className={styles.alert}>
            {errors.name.message}
          </div>
        )}
      </div>
      <div className={styles.field}>
        <label htmlFor="kana" className={styles.label}>
          かな
        </label>
        <Textbox id="kana" {...filedValues.kana} />
      </div>
      <div className={styles.field}>
        <label htmlFor="displayName" className={styles.label}>
          表示名
        </label>
        <Textbox id="displayName" {...filedValues.displayName} />
      </div>
      <div className={styles.field}>
        <label htmlFor="sex" className={styles.label}>
          性別（必須）
        </label>
        <RadioGroup
          id="sex"
          defaultValue={sexOptions[0].value}
          flexDirection="row"
          options={sexOptions}
          {...filedValues.sex}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="level" className={styles.label}>
          レベル（必須）
        </label>
        <RadioGroup
          id="level"
          defaultValue={levelOptions[0].value}
          flexDirection="row"
          options={levelOptions}
          {...filedValues.level}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="note" className={styles.label}>
          メモ
        </label>
        <Textarea id="note" {...filedValues.note} />
      </div>
      <Button type="submit" text="メンバーを追加する" color="green" />
    </form>
  );
};

export default NewMemberForm;
