import styled from 'styled-components';

export const FeedItemStyle = styled.div`
  .py-reply {
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
  }

  .text-reply {
    font-size: 0.9125rem;
    line-height: 1.25rem;
  }

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

  @media (max-width: 639px) {
    .feed-actions {
      .wrapper-tooltip-more-action {
        position: absolute;
        top: 50%;
        left: -15px;
      }
      .tooltip-more-action {
        top: 50%;
        transform: translate(-100%, -50%);
      }
      .arrow-more-action {
        right: 0;
        top: 0;
        bottom: 0;
        transform: translateX(100%) rotate(180deg);
      }
    }
  }

  @media (min-width: 640px) {
    .feed-actions {
      .wrapper-tooltip-more-action {
        position: absolute;
        top: 100%;
        left: 50%;
      }
      .tooltip-more-action {
        transform: translate(-50%, 15px);
      }
      .arrow-more-action {
        left: 0;
        right: 0;
        margin: 0 auto;
        transform: translateY(-53%) rotate(90deg);
      }
    }
  }
`;
