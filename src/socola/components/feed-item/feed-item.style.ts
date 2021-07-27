import styled from 'styled-components';

export const FeedItemStyle = styled.div`
  .one-primary-feed {
    .btn-more-option-feed-hover {
      opacity: 0;
      visibility: hidden;
    }

    &:hover {
      .btn-more-option-feed {
        opacity: 100%;
        visibility: visible;
      }
    }
  }

  @media (max-width: 991px) {
    .one-primary-feed {
      .btn-more-option-feed-hover {
        opacity: 100%;
        visibility: visible;
      }
    }
  }

  .w-fit-content {
    width: fit-content;
  }

  .feed-actions {
    .wrapper-tooltip-bottom {
      position: absolute;
      top: 100%;
      left: 50%;
    }
    .tooltip-bottom {
      transform: translate(-50%, 15px);
    }
    .arrow-bottom {
      left: 0;
      right: 0;
      margin: 0 auto;
      transform: translateY(-53%) rotate(90deg);
    }
  }
`;
