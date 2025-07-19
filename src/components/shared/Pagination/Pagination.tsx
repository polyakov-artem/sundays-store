import { FC, memo, ReactNode, useMemo } from 'react';
import { Link, useLocation, useSearchParams, type Location } from 'react-router';
import { getPaginationRange, NUMBERS_PLACEHOLDER } from './getPaginationRange';
import classNames from 'classnames';
import './Pagination.scss';

export const PAGINATION = 'pagination';
export const PAGINATION_ITEM = `${PAGINATION}__item`;
export const PAGINATION_BTN = `${PAGINATION}__btn`;
export const PAGINATION_PLACEHOLDER = `${PAGINATION}__placeholder`;
export const PAGINATION_BTN_SELECTED = `${PAGINATION_BTN}_selected`;
export const PAGINATION_BTN_DISABLED = `${PAGINATION_BTN}_disabled`;
export const PAGINATION_BTN_NEXT = `${PAGINATION}__btn-next`;
export const PAGINATION_BTN_PREV = `${PAGINATION}__btn-prev`;

export type TPaginationProps = {
  totalCount: number | undefined;
  perPageCount: number;
  maxNumOfVisiblePages?: number;
  className?: string;
  prevBtnLabel?: ReactNode;
  nextBtnLabel?: ReactNode;
};

export const ERROR_MINIMAL_NUMBER_OF_VISIBLE_PAGES = 'Number of visible pages should be at least 7';
export const KEY_PAGE = 'page';

const getLinkURL = (location: Location, pageNumber: number | string) => {
  const { pathname, search } = location;
  const searchParams = new URLSearchParams(search);
  searchParams.set(KEY_PAGE, `${pageNumber}`);
  return `${pathname}?${searchParams.toString()}`;
};

const Pagination: FC<TPaginationProps> = ({
  perPageCount,
  className,
  totalCount = 0,
  maxNumOfVisiblePages = 7,
  prevBtnLabel = '«',
  nextBtnLabel = '»',
}) => {
  if (maxNumOfVisiblePages < 7) throw new Error(ERROR_MINIMAL_NUMBER_OF_VISIBLE_PAGES);

  const numberOfPages = Math.ceil(totalCount / perPageCount);
  const [params] = useSearchParams();
  const location = useLocation();
  const currentPageParam = params.get(KEY_PAGE);
  const currentPage = useMemo(() => {
    const parsedPageNumber = parseInt(currentPageParam || '');

    return isNaN(parsedPageNumber) || parsedPageNumber <= 0
      ? 1
      : parsedPageNumber > numberOfPages
        ? numberOfPages
        : parsedPageNumber;
  }, [currentPageParam, numberOfPages]);

  const paginationRange = useMemo(
    () =>
      getPaginationRange({
        numberOfPages,
        numOfVisibleButtons: maxNumOfVisiblePages,
        currentPage,
      }),
    [numberOfPages, maxNumOfVisiblePages, currentPage]
  );

  const isLastPage = currentPage === numberOfPages;
  const isFirstPage = currentPage === 1;

  const prevBtnClasses = classNames(PAGINATION_BTN, PAGINATION_BTN_PREV, {
    [PAGINATION_BTN_DISABLED]: isFirstPage,
  });

  const prevBtn = useMemo(() => {
    const pageUrl = getLinkURL(location, currentPage - 1);

    return (
      <li className={PAGINATION_ITEM}>
        {isFirstPage ? (
          <span className={prevBtnClasses}>{prevBtnLabel}</span>
        ) : (
          <Link className={prevBtnClasses} to={pageUrl} relative="path">
            {prevBtnLabel}
          </Link>
        )}
      </li>
    );
  }, [currentPage, isFirstPage, prevBtnClasses, prevBtnLabel, location]);

  const nextBtnClasses = classNames(PAGINATION_BTN, PAGINATION_BTN_NEXT, {
    [PAGINATION_BTN_DISABLED]: isLastPage,
  });

  const nextBtn = useMemo(() => {
    const pageUrl = getLinkURL(location, currentPage + 1);

    return (
      <li className={PAGINATION_ITEM}>
        {isLastPage ? (
          <span className={nextBtnClasses}>{nextBtnLabel}</span>
        ) : (
          <Link className={nextBtnClasses} to={pageUrl} relative="path">
            {nextBtnLabel}
          </Link>
        )}
      </li>
    );
  }, [currentPage, isLastPage, nextBtnClasses, nextBtnLabel, location]);

  const links = useMemo(() => {
    return paginationRange?.map((number, index) => {
      const linkClassName = classNames(PAGINATION_BTN, {
        [PAGINATION_BTN_SELECTED]: currentPage === number,
      });

      const pageUrl = getLinkURL(location, number);

      return (
        <li className={PAGINATION_ITEM} key={`${index}_${number}`}>
          {number === NUMBERS_PLACEHOLDER ? (
            <span className={PAGINATION_PLACEHOLDER}>{number}</span>
          ) : (
            <Link className={linkClassName} to={pageUrl} relative="path">
              {number}
            </Link>
          )}
        </li>
      );
    });
  }, [currentPage, paginationRange, location]);

  const paginationClasses = classNames(PAGINATION, className);

  return (
    <ul className={paginationClasses}>
      {prevBtn}
      {links}
      {nextBtn}
    </ul>
  );
};

export default memo(Pagination);
