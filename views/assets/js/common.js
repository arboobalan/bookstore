
$(document).ready(function () {

    $('#bookForm').submit(function (event) {
        event.preventDefault();

        var form = $(this)[0];
        if (!form.checkValidity()) {
            $(form).addClass('was-validated');
            return;
        }
        var formData = new FormData(this);

        $.ajax({
            url: 'http://localhost:3001/',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                if (res.meta.error == 200) {
                    Swal.fire({
                        title: 'Success!',
                        text: res.meta.msg,
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        location.reload();
                    });
                } else {
                    Swal.fire({
                        title: 'warning!',
                        text: res.meta.msg,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            },
            error: function (err) {
                Swal.fire({
                    title: 'Error!',
                    text: 'An error occurred while processing the request.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        });
    });

    //DELETE
    $('.delete-btn').on('click', function () {
        const bookId = $(this).data('book_id');

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `http://localhost:3001/books/${bookId}`,
                    type: 'DELETE',
                    success: function (res) {
                        if (res.meta.error == 200) {
                            Swal.fire({
                                title: 'Deleted!',
                                text: res.meta.msg,
                                icon: 'success',
                                confirmButtonText: 'OK'
                            }).then(() => {
                                location.reload();
                            });
                        } else {
                            Swal.fire({
                                title: 'Error!',
                                text: res.meta.msg,
                                icon: 'error',
                                confirmButtonText: 'OK'
                            });
                        }
                    },
                    error: function () {
                        Swal.fire({
                            title: 'Error!',
                            text: 'An error occurred while deleting the record.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                });
            }
        });
    });
});

$(document).on('click', '.edit-btn', function () {
    var bookId = $(this).data('book_id');
    var bookName = $(this).data('book_name');
    var bookAuthor = $(this).data('book_author');
    var bookPages = $(this).data('book_pages');
    var bookPrice = $(this).data('book_price');

    $('#book_id').val(bookId);
    $('#book_name').val(bookName);
    $('#book_author').val(bookAuthor);
    $('#book_pages').val(bookPages);
    $('#book_price').val(bookPrice);

    $('#bookModalLabel').text('Edit Book');
    $('#savebtn').text('Update');
});
$('#bookForm').submit(function (e) {
    e.preventDefault();

    var formData = $(this).serialize();

    $.ajax({
        url: '/save-book',
        method: 'POST',
        data: formData,
        success: function (response) {
            $('#bookModal').modal('hide');
        }
    });
});

// Form - Validation
(function () {
    'use strict';
    window.addEventListener('load', function () {
        var form = document.getElementById('bookForm');
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    }, false);
})();

// Allow Only Text & Space
$('#book_author').on('input', function() {
    var value = $(this).val();
    $(this).val(value.replace(/[^A-Za-z\s]/g, ''));
});

// Allow only numbers
$('#book_pages, #book_price').keypress(function (event) {
    var keyCode = event.which;
    if (!(keyCode >= 48 && keyCode <= 57)) {
        event.preventDefault();
    }
});