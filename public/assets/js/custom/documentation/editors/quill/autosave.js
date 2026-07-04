

    var quill = new Quill('#kt_docs_quill_editor', {
        theme: 'snow', // or 'bubble'
        modules: {
            toolbar: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image', 'video'],
                ['clean']
            ]
        }
    });

    // Capture Quill editor content and update the hidden input
    quill.on('text-change', function () {
        var quillContent = quill.root.innerHTML;
        document.getElementById('blogContent').value = quillContent;
    });
