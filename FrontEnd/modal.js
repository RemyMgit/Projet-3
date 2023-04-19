// Récupération des éléments du DOM
const modifier = document.getElementById("showmodal");
const modal = document.getElementById("modal");
const close = document.getElementsByClassName("close")[0];

// Fonction pour afficher la fenêtre modale
function openModal() {
  modal.style.display = "block";
}

// Fonction pour cacher la fenêtre modale
function closeModal() {
  modal.style.display = "none";
}

// Écouteur d'événement pour ouvrir la fenêtre modale lorsque le bouton est cliqué
modifier.addEventListener("click", function(event) {
  event.preventDefault();
  openModal();
});

// Écouteur d'événement pour fermer la fenêtre modale lorsque le bouton de fermeture est cliqué
close.addEventListener("click", function(event) {
  event.preventDefault();
  closeModal();
});

// Écouteur d'événement pour fermer la fenêtre modale lorsque l'utilisateur clique à l'extérieur de la fenêtre
window.addEventListener("click", function(event) {
  if (event.target == modal) {
    closeModal();
  }
});

// Récupération des images depuis l'API et affichage des images dans la fenêtre modale
fetch('http://localhost:5678/api/works')
.then(response => response.json()) 
.then(data => {
 
  const images = [];
 
  for (const item of data) {
 
    const figure = document.createElement('figure');

    const img = document.createElement('img');
    img.src = item.imageUrl;
    img.alt = item.title;
    img.names = item.category.name;
    img.id = item.id;
    img.setAttribute("crossorigin", "anonymous"); 

    images.push(img);
 
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = item.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
  }
  
  // Écouteur d'événement pour afficher les images dans la fenêtre modale lorsque le bouton est cliqué
  modifier.addEventListener("click", function(event) {
    event.preventDefault();
    displayGalleryImages(images);
    openModal();
  });
});

// Fonction pour afficher les images dans la fenêtre modale
function displayGalleryImages(images) {
  const modalBody = document.querySelector('.modal-body');
  const tokens = localStorage.getItem('token');
  modalBody.innerHTML = '';

  images.forEach(image => {
   
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container'); 
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt;
    img.id = image.id;
    img.classList.add('modal-image');
    img.setAttribute("crossorigin", "anonymous"); 
    imageContainer.appendChild(img);    
    const editSpan = document.createElement('span');
    editSpan.textContent = 'éditer';
    imageContainer.appendChild(editSpan);  
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa-solid', 'fa-trash-can', 'delete-icon');    
    imageContainer.appendChild(deleteIcon);  
    modalBody.appendChild(imageContainer);
    deleteIcon.addEventListener('click', function(event) {
      event.preventDefault();    
      const index = images.indexOf(image);      
      if (confirm('Voulez-vous vraiment supprimer cette image ?')) {       
        images.splice(index, 1);       
        const parent = deleteIcon.parentElement;
        parent.remove();       
        const options = {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + tokens
          }
        };
        // Suppression d'une image
        fetch(`http://localhost:5678/api/works/${img.id}`, options)
        .then(response => {
          if (response.ok) {
            console.log('Image supprimée avec succès');           
            const imageElement = document.getElementById(image.id);
            if (imageElement) {
              imageElement.parentNode.remove();
            }
  
          } else {
            console.log('Une erreur est survenue');
          }
        })
        .catch(error => {
          console.error('Une erreur est survenue', error);
        });
    }
  });
});
}
//ajout d'une photo
const addPhotoBtn = document.querySelector('#ajouter-photo');
addPhotoBtn.addEventListener('click', () => {
  const addPhotoModal = document.querySelector('#add-photo-modal');
  addPhotoModal.style.display = 'block';
});

const addPhotoForm = document.querySelector('#add-photo-form');
addPhotoForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Récupérer les données du formulaire
  const title = document.querySelector('#title').value;
  const category = document.querySelector('#category').value;
  const image = document.querySelector('#image').files[0];
  // On convertit la catégorie en son ID correspondant dans la base de données
  let categoryId;  
  switch (category) {   
    case 'objets':
      categoryId = 1;
      break;
    case 'appartements':
      categoryId = 2;
      break;
    case 'hotel_restaurant':
      categoryId = 3;
      break;    
  }
  
  const token = localStorage.getItem('token');
  
  // Envoie des données à l'API
  const formData = new FormData();
  formData.append('title', title);
  formData.append('category', categoryId);
  formData.append('image', image);

  const options = {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  };
  
  try {
    const response = await fetch('http://localhost:5678/api/works', options);
    categoryId = Number(categoryId);
    

    if (response.ok) {         
      const addPhotoModal = document.querySelector('#add-photo-modal');
      addPhotoModal.style.display = 'none';
      fetchGalleryImages();
    } else {
      alert('Une erreur est survenue lors de l\'ajout de l\'image');
    }
  } catch (error) {
    console.error('Une erreur est survenue', error);
  }
});

const addPhotoModal = document.querySelector('#add-photo-modal');
const addPhotoCloseBtn = addPhotoModal.querySelector('.close');
addPhotoCloseBtn.addEventListener('click', () => {
  addPhotoModal.style.display = 'none';
});
window.addEventListener('click', (event) => {
 
  if (event.target == addPhotoModal) {
    addPhotoModal.style.display = 'none';
  }
});

// Prévisualisation de l'image télécharger
function readFile(e) {
  e.preventDefault();

  const reader = new FileReader();
  reader.addEventListener("load", function () {
    
    const previewImage = document.createElement("img");
    previewImage.setAttribute("id", "preview_image");
    previewImage.setAttribute("src", reader.result);  
   
    previewImage.style.maxWidth = "380px";
    previewImage.style.maxHeight = "220px";
    previewImage.style.width = "auto";
    previewImage.style.height = "auto";
    previewImage.style.objectFit = "cover";
    previewImage.style.objectPosition = "center center";
    previewImage.style.transform = "translateY(-17px)";
    previewImage.style.opacity = "1";     
 
    const picture = document.querySelector(".picture");
    picture.appendChild(previewImage);
    const label = document.querySelector(".picture > label");
    label.style.opacity = "0"; 
    const logoImage = document.querySelector("#logo_image");
    const pMaxSize = document.querySelector(".picture > p");
    logoImage.style.display = "none";
    pMaxSize.style.display = "none";
  });   
  reader.readAsDataURL(inputFile.files[0]);
}
const inputFile = document.getElementById("image");
inputFile.addEventListener("change", readFile);