import onChange from 'on-change';

export default (elements, state, i18n) => {
  const {
    body, form, formField, validationElement, submitButton, containerPosts,
    containerFeeds, containerModalWindow, modalTitle, modalBody, modalLink,
  } = elements;

  const renderContent = () => {
    containerPosts.innerHTML = '';
    containerFeeds.innerHTML = '';

    // Добавляем посты
    const postSubContainer = document.createElement('div');
    postSubContainer.classList.add('card', 'border-0');
    const postTitleContainer = document.createElement('div');
    postTitleContainer.classList.add('card-body');

    const titlePostTextElem = document.createElement('h2');
    titlePostTextElem.classList.add('card-title', 'h4');
    titlePostTextElem.textContent = i18n.t('posts');
    postTitleContainer.append(titlePostTextElem);

    const postList = document.createElement('ul');
    postList.classList.add('list-group', 'border-0', 'rounded-0');
    postSubContainer.append(postTitleContainer, postList);
    containerPosts.append(postSubContainer);

    // eslint-disable-next-line array-callback-return
    state.posts.map((post) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      const link = document.createElement('a');
      link.classList.add('fw-bold');
      link.setAttribute('href', `${post.link}`);
      link.setAttribute('target', '_blank');
      link.setAttribute('data-id', post.postId);
      link.textContent = post.name;

      const button = document.createElement('button');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.setAttribute('type', 'button');
      button.setAttribute('data-bs-toogle', 'modal');
      button.setAttribute('data-bs-target', '#modal');
      button.setAttribute('data-id', post.postId);
      button.textContent = i18n.t('buttonText');

      li.append(link, button);

      postList.append(li);
    });

    // Добавляем фиды
    const feedsSubContainer = document.createElement('div');
    feedsSubContainer.classList.add('card', 'border-0');
    const titleFeedsContainer = document.createElement('div');
    titleFeedsContainer.classList.add('card-body');

    const titleFeedsTextElement = document.createElement('h2');
    titleFeedsTextElement.classList.add('card-title', 'h4');
    titleFeedsTextElement.textContent = i18n.t('feeds');
    titleFeedsContainer.append(titleFeedsTextElement);

    const feedList = document.createElement('ul');
    feedList.classList.add('list-group', 'border-0', 'rounded-0');
    feedsSubContainer.append(titleFeedsTextElement, feedList);
    containerFeeds.append(feedsSubContainer);

    // eslint-disable-next-line array-callback-return
    state.feeds.map((feed) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'border-0', 'border-end-0');
      const titleEl = document.createElement('h3');
      titleEl.classList.add('h6', 'm-0');
      titleEl.textContent = feed.name;

      const textEl = document.createElement('p');
      textEl.classList.add('m-0', 'small', 'text-black-50');
      textEl.textContent = feed.desc;

      li.append(titleEl, textEl);

      feedList.append(li);
    });

    validationElement.textContent = i18n.t(state.form.validationMessage);
    validationElement.classList.remove('text-danger');
    validationElement.classList.add('text-success');

    formField.classList.remove('is-invalid');

    form.reset();
    formField.focus();
  };

  const renderModalWindow = () => {
    body.classList.add('modal-open');
    body.style.overflow = 'hidden';
    body.style.padding = '0 17px 0 0';
    containerModalWindow.classList.add('show');
    containerModalWindow.style.display = 'block';

    modalTitle.textContent = state.touchedPost.name;
    modalBody.textContent = state.touchedPost.desc;
    modalLink.setAttribute('href', `${state.touchedPost.link}`);

    const backDropElement = document.createElement('div');
    backDropElement.classList.add('modal-backdrop', 'fade', 'show');
    body.append(backDropElement);
  };

  const renderCloseModalWindow = () => {
    body.classList.remove('modal-open');
    body.style = 'none';
    containerModalWindow.classList.remove('show');
    containerModalWindow.style.display = 'none';

    const backDropElement = document.querySelector('.modal-backdrop');
    backDropElement.remove();
  };

  const handleRenderError = () => {
    formField.classList.add('is-invalid');
    validationElement.textContent = state.form.validationMessage;
    validationElement.classList.add('text-danger');
  };

  const touchedPost = () => {
    const element = document.querySelector(`[data-id="${state.touchedPost.postId}"]`);
    console.log(element);
    element.classList.remove('fw-bold');
    element.classList.add('fw-normal');
  };

  const renderPosts = () => {
    containerPosts.innerHTML = '';

    const postSubContainer = document.createElement('div');
    postSubContainer.classList.add('card', 'border-0');
    const postTitleContainer = document.createElement('div');
    postTitleContainer.classList.add('card-body');

    const titlePostTextElem = document.createElement('h2');
    titlePostTextElem.classList.add('card-title', 'h4');
    titlePostTextElem.textContent = i18n.t('posts');
    postTitleContainer.append(titlePostTextElem);

    const postList = document.createElement('ul');
    postList.classList.add('list-group', 'border-0', 'rounded-0');
    postSubContainer.append(postTitleContainer, postList);
    containerPosts.append(postSubContainer);

    // eslint-disable-next-line array-callback-return
    state.posts.map((post) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      const link = document.createElement('a');
      link.classList.add('fw-bold');
      link.setAttribute('href', `${post.link}`);
      link.setAttribute('target', '_blank');
      link.setAttribute('data-id', post.postId);
      link.textContent = post.name;

      const button = document.createElement('button');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.setAttribute('type', 'button');
      button.setAttribute('data-bs-toogle', 'modal');
      button.setAttribute('data-bs-target', '#modal');
      button.setAttribute('data-id', post.postId);
      button.textContent = i18n.t('buttonText');

      li.append(link, button);

      postList.append(li);
    });
  };

  const handleModalWindow = (value) => {
    switch (value) {
      case true: renderModalWindow();
        break;

      case false: renderCloseModalWindow();
        break;

      default:
        break;
    }
  };

  const handleValidation = (value) => {
    switch (value) {
      case 'loaded': renderContent();
        break;

      case 'validationError': handleRenderError();
        break;

      case 'loading': submitButton.disabled = true;
        break;

      case 'invalidRss': handleRenderError();
        break;

      case 'networkError': handleRenderError();
        break;

      default:
        break;
    }
  };

  const handleUpdatePosts = (value) => {
    switch (value) {
      case 'newpost': renderPosts();
        break;

      default:
        break;
    }
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.status': handleValidation(value);
        break;

      case 'touchedPost': touchedPost();
        break;

      case 'modalWindowOpen': handleModalWindow(value);
        break;

      case 'processUpdatePosts.status': handleUpdatePosts(value);
        break;

      default:
        break;
    }
  });

  return watchedState;
};
