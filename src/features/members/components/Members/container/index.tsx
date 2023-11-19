import { useFilter } from './hooks/useFilter';
import { useMembers } from './hooks/useMembers';
import { useSort } from './hooks/useSort';
import Component from '@/features/members/components/Members/presentation';
import { useRouter } from 'next/router';
import { useMemo, useRef, useState } from 'react';

import type { FormValues } from '../../modals/SortModal';
import type { Level, Sex } from '@prisma/client';
import type { SubmitHandler } from 'react-hook-form';

const Members = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { members, isError, isLoading } = useMembers();
  const { options, selectSortKey, selectedSortKey, sortMembers } = useSort();
  const {
    selectedSexes,
    selectedLevels,
    selectSexes,
    selectLevels,
    filterMembers,
  } = useFilter();
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const displayMembers = useMemo(() => {
    let _members = members;

    (() => {
      _members = sortMembers(_members);
      _members = filterMembers(_members);
    })();

    return _members;
  }, [filterMembers, members, sortMembers]);

  // if any filter condition is selected and there's no member that should be displayed,
  // render an empty state alternatively.
  const shouldShowEmptyState =
    (selectedSexes.length !== 0 || selectedLevels.length !== 0) &&
    displayMembers.length === 0;

  const toggleSortModal = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (dialog.open) {
      dialog.close();
    } else {
      dialog.showModal();
    }
  };
  const handleFilterModalToggle = () => {
    setIsFilterModalOpen((previousState) => !previousState);
  };
  const handleFilterFormSubmit = (data: { sexes: Sex[]; levels: Level[] }) => {
    selectSexes(data.sexes);
    selectLevels(data.levels);
    setIsFilterModalOpen(false);
  };
  const handleNewMemberButtonClick = () => {
    void router.push('/members/new');
  };
  const handleSortModalSubmit: SubmitHandler<FormValues> = (data) => {
    selectSortKey(data.sortKey);
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  return (
    <Component
      isError={isError}
      isLoading={isLoading}
      members={displayMembers}
      options={options}
      initialSortKey="createdAt"
      selectedSortKey={selectedSortKey}
      selectedSex={selectedSexes}
      selectedLevels={selectedLevels}
      selectSortKey={selectSortKey}
      onFilterFormSubmit={handleFilterFormSubmit}
      isFilterModalOpen={isFilterModalOpen}
      toggleSortModal={toggleSortModal}
      shouldShowEmptyState={shouldShowEmptyState}
      onFilterModalToggle={handleFilterModalToggle}
      onClickNewMemberButton={handleNewMemberButtonClick}
      onSortModalSubmit={handleSortModalSubmit}
      ref={dialogRef}
    />
  );
};

export default Members;
