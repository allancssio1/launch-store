const Mask = {
  apply(input, eventFunction) {
    setTimeout(function(){
      input.value = Mask[eventFunction](input.value)
    }, 1)
  },
  formatBRL(value){
    // /\x/ => expreção regular onde x pode ser tais informações
    // \D => não digitos
    // \d => digitos
    // g => global (tudo)
    value = value.replace(/\D/g, '')
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value/100)
  },
  cpfCnpj(value) {
    value = value.replace(/\D/g, "")

    if(value.length > 14) {
      value = value.slice(0, -1)
    }

    /* chef if cnpj => 99.999.999/0001-99
    * else is cpf => 999.999.999-99
    * (\d{repete x vezes}), "valor"
    */
    if(value.length > 11) {

      value = value.replace(/(\d{2})(\d)/, "$1.$2")
      value = value.replace(/(\d{3})(\d)/, "$1.$2")
      value = value.replace(/(\d{3})(\d)/, "$1/$2")
      value = value.replace(/(\d{4})(\d)/, "$1-$2")


    } else {

      value = value.replace(/(\d{3})(\d)/, "$1.$2")
      value = value.replace(/(\d{3})(\d)/, "$1.$2")
      value = value.replace(/(\d{3})(\d)/, "$1-$2")

    }

    return value


  },
  cep (value) {
    value = value.replace(/\D/g, "")

    if (value.length > 8) {
      value = value.slice(0, -1)
    }

    value = value.replace(/(\d{5})(\d)/, "$1-$2")

    return value
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
    if(PhotosUpload.hasLimit(event)) {
      PhotosUpload.updateUploadFiles()
      return
    }
    
    Array.from(fileList).forEach(file   => {
      PhotosUpload.files.push(file)
      const reader = new FileReader()

      reader.onload = () => {
        const image = new Image() //Constructor que cria imagem, como se fosse o createElement(img)
        image.src = String(reader.result)

        const div = PhotosUpload.getContainer(image)
        PhotosUpload.preview.appendChild(div)
      }

      reader.readAsDataURL(file)
    })
    PhotosUpload.updateUploadFiles()
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
      alert(`Você atingiu o limite máximo de fotos.`)
      event.preventDefault()
      return true
    }
    return false
  },
  getAllFiles(){
    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

    PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

    return dataTransfer.files
  },
  getContainer(image) {
    //Div que vai ser gerado como lista para armazenar cada foto carregada.
    const div = document.createElement('div')

    div.classList.add('photo') //Adiciona a class photo na div creada
    div.onclick = PhotosUpload.removePhoto //põe um evento de clique na div
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
    
    const photosArray = Array.from(PhotosUpload.preview.children) // transforma em array as photos filhas de .photos-preview
    const newFiles = photosArray.filter(file => {
      if (file.classList.contains('photo') && !file.getAttribute('id')) return true
    })
    const index = newFiles.indexOf(photoDiv) //pega a posição do array em que houve o click de delete.
    PhotosUpload.files.splice(index, 1) //splice vai remover o item no index informado e somente ele 

    PhotosUpload.updateUploadFiles()

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
  },
  updateUploadFiles() {

    PhotosUpload.input.files = PhotosUpload.getAllFiles() //atualiza os arquivos do input file.
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

const Validate = {
  apply(input, func) {
    Validate.clearErrors(input)
    
    let results = Validate[func](input.value)
    input.value = results.value
    
    if (results.error)
      Validate.displayError(input, results.error)

  },
  clearErrors(input) {
    const errorDiv = input.parentNode.querySelector('.error')
    if (errorDiv){
      errorDiv.remove()

    }
  },
  displayError(input, error) {
    const div = document.createElement('div')

    div.classList.add('error')
    div.innerHTML = error

    input.parentNode.appendChild(div)

    input.focus
  },
  isEmail(value) {
    let error = null

    /* ^ => obrigação inicial
    * \w => caractéries
    * + => 1 ou mais
    * ? => não é certeza vir a informação
    * \simbolos em qualquer serquência => síbolos que será permitido usar.
    * () => agrupar informação antes de uma alteração.
    */

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if(!value.match(mailFormat))
      error = 'Email inválido'

    return { error, value }
  },
  isCpfCnpj(value) {
    let error = null
    const clearValues = value.replace(/\D/g, "")

    if (clearValues.length > 11 && clearValues.length !== 14) {
      error = "CNPJ incorreto"
    } else if (clearValues.length < 12 && clearValues.length !== 11) {
      error = "CPF incorreto"
    }
    return {error, value}
  },
  isCep(value) {
    let error = null

    const clearValues = value.replace(/\D/g, "")

    if (clearValues.length !== 8) {
      error = "Cep incorreto"
    }

    return {error, value}
  }
}