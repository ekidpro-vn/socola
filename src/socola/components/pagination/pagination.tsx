import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getFeedsFromApi } from '../../../store/action';
// import { pushParamURL } from 'utils/helper';
import { getProps } from '../../../utils/helper';

export interface PaginationType {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

interface PaginationProps {
  pagination?: PaginationType | null;
}

export const Pagination: React.FC<PaginationProps> = (props) => {
  const { page, size, totalItems, totalPages } = props.pagination;
  const history = useHistory();
  const dispatch = useDispatch();
  const dataProps = useSelector(getProps);
  const { moduleId, recordId, channelId } = dataProps;

  const onNextLastPage = useCallback(() => {
    if (page === totalPages) {
      return;
    }
    dispatch(getFeedsFromApi(moduleId, recordId, channelId, totalPages));
  }, [page, totalPages, channelId, recordId, moduleId, dispatch]);

  const onPrevFirstPage = useCallback(() => {
    if (page === 1) {
      return;
    }
    dispatch(getFeedsFromApi(moduleId, recordId, channelId, 1));
  }, [page, channelId, recordId, moduleId, dispatch]);

  const onNextPage = useCallback(() => {
    if (page >= totalPages) {
      return;
    }
    dispatch(getFeedsFromApi(moduleId, recordId, channelId, page + 1));
  }, [page, totalPages, channelId, recordId, moduleId, dispatch]);

  const onPrevPage = useCallback(() => {
    if (page <= 1) {
      return;
    }
    dispatch(getFeedsFromApi(moduleId, recordId, channelId, page - 1));
  }, [page, channelId, recordId, moduleId, dispatch]);

  const listPage: number[] = [];

  for (let i = page - 2; i < page + 3; i++) {
    if (i > 0 && i <= totalPages && page <= totalPages) {
      if (page < 3) {
        listPage.push(i);
      } else if (page >= 3 && page <= totalPages - 3) {
        listPage.push(i);
      } else if (page > totalPages - 3) {
        listPage.push(i);
      }
    }
  }

  if (!props.pagination) {
    return null;
  }

  return (
    <div className="flex justify-center my-20">
      <div className="flex items-center justify-center">
        <span
          onClick={onPrevFirstPage}
          className={`${
            page === 1 ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-green-600 hover:text-white'
          } text-gray-600 duration-300 rounded rounded-r-none border-r-0 font-bold text-lg border border-gray-300 w-10 h-10 flex justify-center items-center`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>

        <span
          onClick={onPrevPage}
          className={`${
            page <= 1 ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-green-600 hover:text-white'
          } text-gray-600 duration-300 border-r-0 font-bold text-lg border w-10 h-10 border-gray-300 flex justify-center items-center`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>

        {page > 3 && page <= totalPages && <span className="block mx-2">. . .</span>}

        {listPage &&
          listPage.length > 0 &&
          listPage.map((item) => {
            return (
              <span
                key={`number_${item}`}
                onClick={() => dispatch(getFeedsFromApi(moduleId, recordId, channelId, item))}
                className={`${
                  item === page ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-green-600 hover:text-white'
                } border-r-0 duration-300 w-10 h-10 font-bold text-lg border-gray-300 cursor-pointer border flex justify-center items-center`}
              >
                {item}
              </span>
            );
          })}

        {page > 0 && page < totalPages - 2 && <span className="block">. . .</span>}

        <span
          onClick={onNextPage}
          className={`${
            page >= totalPages ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-green-600 hover:text-white'
          } text-gray-600 duration-300 border-r-0 font-bold border-gray-300 text-lg border w-10 h-10 flex justify-center items-center`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>

        <span
          onClick={onNextLastPage}
          className={`${
            page === totalPages ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-green-600 hover:text-white'
          } text-gray-600 duration-300 rounded rounded-l-none font-bold text-lg border-gray-300 border w-10 h-10 flex justify-center items-center`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
    </div>
  );
};
