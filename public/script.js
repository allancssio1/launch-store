const Mask = {
  apply(input, eventFunction) {
    setTimeout(function(){
      input.value = Mask[eventFunction](input.value)
    }, 1)
  },
  formatBRL(value){
    value = value.replace(/\D/g, '')
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value/100)
  }
}

const PhotosUpload = {
  input: "",
  preview: document.querySelector('#photos-preview'),
  uploadLimit: 6,
  files: [],
  handleFileInput(event){
    const {files: fileList} = event.target
    PhotosUpload.input = event.target
    if(PhotosUpload.hasLimit(event)) return
    
    Array.from(fileList).forEach(file   => {
      PhotosUpload.files.push(file)
      const reader = new FileReader()
      reader.onload = () => {
        //Constructor que cria imagem, como se fosse o createElement(img)
        const image = new Image() 
        image.src = String(reader.result)
        const div = PhotosUpload.getContainer(image)
        PhotosUpload.preview.appendChild(div)
      }
      reader.readAsDataURL(file)
    })
    PhotosUpload.input.files = PhotosUpload.getAllFiles()
  },
  hasLimit(event){
    const {uploadLimit, input, preview} = PhotosUpload
    const {files: fileList} = input
    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`)
      event.preventDefault()
      return true
    }
    let photosDiv = []
    preview.childNodes.forEach(item => {
      if(item.classList && item.classList.value == "photo")
        photosDiv.push(item)
    })
    const totalPhotos = fileList.length + photosDiv.length
    if (totalPhotos > uploadLimit) {
      alert(`Você atingil o limite máximo de fotos.`)
      event.preventDefault()
      return true
    }
    return false
  },
  getAllFiles(){
    const dataTrasnfer = new ClipboardEvent("").clipboardData || new DataTransfer()
    PhotosUpload.files.forEach(file => dataTrasnfer.items.add(file))
    return dataTrasnfer.files
  },
  getContainer(image) {
    //Div que vai ser gerado como lista para armazenar cada foto carregada.
    const div = document.createElement('div')
    div.classList.add('photo')
    div.onclick = PhotosUpload.removePhoto
    div.appendChild(image)
    div.appendChild(PhotosUpload.getRemoveButton())
    return div
  },
  getRemoveButton() {
    const button = document.createElement('i')
    button.classList.add('material-icons')
    button.innerHTML = 'close'
    return button
  },
  removePhoto(event) {
    const photoDiv = event.target.parentNode //<div class="photo">
    const photosArray = Array.from(PhotosUpload.preview.children)
    const index = photosArray.indexOf(photoDiv)
    //splice vai remover o item no index informado e somente ele 
    PhotosUpload.files.splice(index, 1)
    PhotosUpload.input.files = PhotosUpload.getAllFiles()

    photoDiv.remove()
  
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode 

    if(photoDiv.id) {
      const removedFiles = document.querySelector('input[name="removed_files"]')
      if(removedFiles) {
        removedFiles.value += `${photoDiv.id},`
      }
    }
    photoDiv.remove()
  }

}

const ImageGallery = {
  previews: document.querySelectorAll('.gallery-preview img'),
  highlight: document.querySelector('.gallery .highlight > img'),
  setImage(e) {
    const {target} = e


    ImageGallery.previews.forEach(preview => preview.classList.remove('active'))

    target.classList.add('active')
    
    ImageGallery.highlight.src = target.src
    Lightbox.image.src = target.src
  }
}

const Lightbox = {
  target: document.querySelector('.lightbox-target'),
  image: document.querySelector('.lightbox-target img'),
  closeButton: document.querySelector('.lightbox-target .lightbox-close'),
  open() {
    Lightbox.target.style.opacity = 1
    Lightbox.target.style.top = 0
    Lightbox.target.style.botton = 0
    Lightbox.closeButton.style.top = 0
  },
  close() {
    Lightbox.target.style.opacity = 0
    Lightbox.target.style.top = '-100%'
    Lightbox.target.style.botton = 'initial'
    Lightbox.closeButton.style.top = '-80px'
  }
}