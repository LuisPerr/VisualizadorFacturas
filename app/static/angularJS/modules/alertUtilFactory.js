// -- =============================================
// -- Author:      Vladimir Juárez
// -- Create date: 18/03/2016
// -- Description: toastr alerts
// -- Modificó:
// -- Fecha:
// -- =============================================
app.factory('AlertFactory', function() {
    return {
        success: function(text) {
            toastr.options = {
                "positionClass": "toast-top-right",
                "closeButton": true
            }
            toastr.success(text, '¡Éxito!');
        },
        successTopFull: function(text) {
            toastr.options = {
                "positionClass": "toast-top-full-width",
                "closeButton": true
            }
            toastr.success(text, '¡Éxito!');
        },
        error: function(text) {
            toastr.options = {
                "positionClass": "toast-top-right",
                "closeButton": true
            }
            toastr.error(text, 'Error');
        },
        errorTopFull: function(text) {
            toastr.options = {
                "positionClass": "toast-top-full-width",
                "closeButton": true
            }
            toastr.error(text, 'Error');
        },
        info: function(text) {
            toastr.options = {
                "positionClass": "toast-top-right",
                "closeButton": true
            }
            toastr.info(text, 'Información');
        },
        infoTopFull: function(text) {
            toastr.options = {
                "positionClass": "toast-top-full-width",
                "closeButton": true
            }
            toastr.info(text, 'Información')
        }
    };
});
