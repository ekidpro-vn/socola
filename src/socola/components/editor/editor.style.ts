import styled from 'styled-components';

export const EditorStyle = styled.div`
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

  .milestone {
    height: 38px !important;
  }
`;
