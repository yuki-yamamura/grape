import { createBreadcrumbs } from '.';

import type { Breadcrumb } from '@/types/Breadcrumb';

describe('createBreadcrumbs', () => {
  describe('returns correct breadcrumb depending on the path', () => {
    test("if the path indicates '/'", () => {
      // arrange
      const path = '/';
      const expected: Breadcrumb[] = [{ path: '/', label: 'ホーム' }];

      // act
      const result = createBreadcrumbs(path);

      // assert
      expect(result.sort()).toEqual(expected);
    });

    test("if the path indicates '/members/new'", () => {
      // arrange
      const path = '/members/new';
      const expected: Breadcrumb[] = [
        { path: '/members', label: 'メンバー' },
        { path: '/members/new', label: 'メンバー追加' },
      ];

      // act
      const result = createBreadcrumbs(path);

      // assert
      expect(result.sort()).toEqual(expected);
    });

    test("if the path indicates '/activities/clsm7h1vi0006dam59dq1legc/games/new'", () => {
      // arrange
      const path = '/activities/clsm7h1vi0006dam59dq1legc/games/new';
      const expected: Breadcrumb[] = [
        {
          path: '/activities/clsm7h1vi0006dam59dq1legc/games',
          label: 'ゲーム',
        },
        {
          path: '/activities/clsm7h1vi0006dam59dq1legc/games/new',
          label: 'ゲーム追加',
        },
      ];

      // act
      const result = createBreadcrumbs(path);

      // assert
      expect(result.sort()).toEqual(expected);
    });
  });
});