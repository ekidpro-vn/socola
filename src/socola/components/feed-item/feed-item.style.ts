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

  @media (max-width: 576px) {
    .wrap-image-more-action {
      width: 83%;
    }
  }

  @media (min-width: 577px) {
    .wrap-image-more-action {
      width: 91%;
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

  .w-max-content {
    width: max-content;
  }

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
`;
