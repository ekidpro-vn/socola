import styled from 'styled-components';

export const TextAreaStyle = styled.div`
  .preview-image {
    button {
      opacity: 0;
      visibility: hidden;
    }

    img {
      box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.15);
    }

    &:hover {
      button {
        opacity: 100%;
        visibility: visible;
      }
    }
  }
`;
