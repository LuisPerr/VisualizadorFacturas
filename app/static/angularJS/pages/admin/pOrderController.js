app.controller('pOrderController', function($scope, $rootScope ,$stateParams, $filter, User, Company, Branch, Order, File, Filtro) {
    $rootScope.companyList = [];
    $rootScope.branchList = [];
    $scope.orderList = [];
    $scope.itemsPerPage = 5;
    $scope.currentPage = 0;
    $scope.branchSelectVisible = false;
    $scope.visible = false;
    //Order
    $scope.orderDate = "";
    $scope.orderImport = "";
    $scope.orderName = "";
    $scope.orderDetail = "";
    $scope.currentUser;

    //LQMA 15092017 add departamentos
    $rootScope.deptosLits = [];
    
    $rootScope.fechas = {
        fechaIni: '',
        fechaFin: ''
    }

    $rootScope.fechaIni = '';
    $rootScope.fechaFin = '';
    $rootScope.detalleOrdenFiltro = '';
    $rootScope.proveedor;
    
    console.log('count: ',$rootScope.contador)    

    /*if($rootScope.contador != 1)
        $rootScope.contador = 0;
    */

    $scope.changeOrderDate = function() {
        if ($scope.orderDate == "") {
            $scope.orderDate = "asc";
        } else if ($scope.orderDate == "asc") {
            $scope.orderDate = "desc";
        } else if ($scope.orderDate == "desc") {
            $scope.orderDate = "asc";
        }
        orderArrayList("oce_fechaorden", $scope.orderDate, true)
    }

    $scope.changeOrderImport = function() {
        if ($scope.orderImport == "") {
            $scope.orderImport = "asc";
        } else if ($scope.orderImport == "asc") {
            $scope.orderImport = "desc";
        } else if ($scope.orderImport == "desc") {
            $scope.orderImport = "asc";
        }
        orderArrayList("oce_importetotal", $scope.orderImport, false)
    }

    $scope.changeOrderName = function() {
        if ($scope.orderName == "") {
            $scope.orderName = "asc";
        } else if ($scope.orderName == "asc") {
            $scope.orderName = "desc";
        } else if ($scope.orderName == "desc") {
            $scope.orderName = "asc";
        }
        orderArrayList("oce_folioorden", $scope.orderName, false,true)
    }

    $scope.changeOrderDetail = function() {
        if ($scope.orderDetail == "") {
            $scope.orderDetail = "asc";
        } else if ($scope.orderDetail == "asc") {
            $scope.orderDetail = "desc";
        } else if ($scope.orderDetail == "desc") {
            $scope.orderDetail = "asc";
        }
        orderArrayList(["emp_nombre","suc_nombre","dep_nombre"], $scope.orderDetail, false,true)
    }

    //Obtiene los proveedores LQMA add 19102017
    $scope.ShowSearchProveedor = function() {       
        $('#searchProveedor').modal('show');
    };

    //Obtiene los proveedores LQMA add 19102017
    $scope.BuscarProveedor = function() {
        Filtro.getProveedor($scope.textProveedor)
            .success(getProveedorSuccessCallback)
            .error(errorCallBack);
    };

    var getProveedorSuccessCallback = function(data, status, headers, config) {
        $rootScope.listaProveedores = data;
        console.log(data)
        //alertFactory.success('Se ha(n) encontrado ' + data.length + ' proveedor(es) que coniciden con la búsqueda.');
    };

    $scope.SetProveedor = function(pro) {
        $rootScope.proveedor = pro;
        $('#searchProveedor').modal('hide');
    };

    $scope.ClearProveedor = function() {
        $rootScope.proveedor = null;
    }

    var errorCallBack = function(data, status, headers, config) {
        $('#btnEnviar').button('reset');
        $('#btnBuscar').button('reset');
        //alertFactory.error('Ocurrio un problema');
    };


    function orderArrayList(field, order, date,string) {

        $scope.orderList.sort(function(a, b) {
            if (date) {
                a[field] = new Date(a[field]).getTime();
                b[field] = new Date(b[field]).getTime();
            }
            if(string){
              var x="",y="";
              if(Array.isArray(field)){
                  x = field.reduce(function(ant,sig){
                      return ant + " "+ a[sig];
                  },"")
                  y = field.reduce(function(ant,sig){
                      return ant + " "+ b[sig];
                  },"")
              }else{
                  x =  a[field]
                  y =  b[field]
              }
              if (order == "asc") {
                return  x >= y ? -1 : 1
              } else if (order == "desc") {
                return  y >= x ? -1 : 1
              }
            }else{
              if (order == "asc") {
                  return a[field] - b[field]
              } else if (order == "desc") {
                  return b[field] - a[field]
              }
            }

        })
    }

    var totalElements;
    User.me().then(function(data) {
        $scope.idProvider = data.data.ppro_userId
        $scope.currentUser = data.data;

        console.log('contador: ',$rootScope.contador)
// modifique 17042017
         /*Order.getPendingByProvider($scope.idProvider,$scope.currentUser.rfc,$scope.currentUser.ppro_idUserRol)
            .then(function(res) {
                console.log($scope.idProvider+' ' +$scope.currentUser.rfc+' ' +$scope.currentUser.ppro_idUserRol)
                $scope.firtList = res.data;
                $scope.orderList = [];
                console.log($scope.orderList.length)
                  for (var h = 0; h < $scope.firtList.length; h++) {
                    if($scope.firtList[h].idEstatusPlanta == 2){
                        //$scope.orderList.splice((h - 1),1);
                        $scope.orderList.push({
                            rowID: $scope.firtList[h].rowID,
                            oce_folioorden: $scope.firtList[h].oce_folioorden,
                            dep_nombre: $scope.firtList[h].dep_nombre,
                            suc_nombre: $scope.firtList[h].suc_nombre,
                            emp_nombre: $scope.firtList[h].emp_nombre,
                            oce_importetotal: $scope.firtList[h].oce_importetotal,
                            emp_nombrecto: $scope.firtList[h].emp_nombrecto,
                            oce_fechaorden: $scope.firtList[h].oce_fechaorden,
                            estatus: $scope.firtList[h].estatus,
                            per_rfc: $scope.firtList[h].per_rfc,
                            oce_uuid: $scope.firtList[h].oce_uuid,
                            oce_imptotalrecibido: $scope.firtList[h].oce_imptotalrecibido,
                            suc_idsucursal: $scope.firtList[h].suc_idsucursal,
                            emp_idempresa: $scope.firtList[h].emp_idempresa,
                            idEstatusPlanta: $scope.firtList[h].idEstatusPlanta,
                            visto: $scope.firtList[h].visto,
                            idEstatusOrden: $scope.firtList[h].idEstatusOrden,
                            nombreProveedor: $scope.firtList[h].nombreProveedor,
                            Recepcion: $scope.firtList[h].Recepcion,
                            Estado: $scope.firtList[h].Estado
                        })
                    }
                  }
                console.log($scope.orderList.length)
                console.log($scope.orderList)
                totalElements = $scope.orderList.length;
                $scope.visible = true;
            })*/

        //LQMA add 15092017 parametros para filtros: empresa, sucursal, departamento, fechaI, fechaF    
        /*
        Order.getPendingByProvider($scope.idProvider,$scope.currentUser.rfc,$scope.currentUser.ppro_idUserRol, company.emp_idempresa, branch.suc_idsucursal, departamento.dep_iddepartamento, fechaIni, fechaFin)
            .then(function(res) {
                console.log($scope.idProvider+' ' +$scope.currentUser.rfc+' ' +$scope.currentUser.ppro_idUserRol + ' ' + company.emp_idempresa+ ' ' + branch.suc_idsucursal+ ' ' +departamento.dep_iddepartamento + ' ' + fechaIni+ ' '+ fechaFin)
                $scope.orderList = res.data;

                console.log(res.data)
                totalElements = $scope.orderList.length;
                $scope.visible = true;
            })
        */

        Company.getByProvider($scope.idProvider,$scope.currentUser.rfc,$scope.currentUser.ppro_idUserRol)
            .then(function(res) {
                
                $rootScope.companyList = res.data;
                //$rootScope.companyR = $rootScope.companyList[0];

                if($rootScope.company != null && $rootScope.company != undefined)    
                    $rootScope.empresaActual = $rootScope.company;

                Branch.getByCompany(($rootScope.company == undefined || $rootScope.company == null)?0:$rootScope.company.emp_idempresa,$scope.currentUser.rfc
                ,$scope.currentUser.ppro_idUserRol,$scope.idProvider)
                    .then(function(res) {
                        $rootScope.branchList = res.data;

                        if($rootScope.branch != null && $rootScope.branch != undefined)    
                            $rootScope.branchActual = $rootScope.branch;                    
                        //$rootScope.branch = $rootScope.branchList[0];
                        filterApply()
                    })
            });

        //LQMA 15092017 add 
        $scope.initCalendarstyle();
        
        if($rootScope.departamento != null && $rootScope.departamento != undefined)    
            $rootScope.departamentoActual = $rootScope.departamento;

        if($rootScope.contador > 0)
        {
             //LQMA 24012018 changed
             //Order.getPendingByProvider($scope.idProvider,$scope.currentUser.rfc,$scope.currentUser.ppro_idUserRol, ($rootScope.company == undefined || $rootScope.company == null)?0:$rootScope.company.emp_idempresa, ($rootScope.branch  == undefined || $rootScope.branch == null)?0:$rootScope.branch.suc_idsucursal, ($rootScope.departamento == undefined || $rootScope.departamento == null)?-1:$rootScope.departamento.dep_iddepartamento, ($rootScope.fechas.fechaIni  != undefined)?$rootScope.fechas.fechaIni.replace('-','').replace('-',''):'', ($rootScope.fechas.fechaFin != undefined)?$rootScope.fechas.fechaFin.replace('-','').replace('-',''):'',($rootScope.proveedor != undefined && $rootScope.proveedor != null)?$rootScope.proveedor.RFC:'')
             Order.getOPendientes($scope.idProvider,$scope.currentUser.rfc,$scope.currentUser.ppro_idUserRol, ($rootScope.company == undefined || $rootScope.company == null)?0:$rootScope.company.emp_idempresa, ($rootScope.branch  == undefined || $rootScope.branch == null)?0:$rootScope.branch.suc_idsucursal, ($rootScope.departamento == undefined || $rootScope.departamento == null)?-1:$rootScope.departamento.dep_iddepartamento, ($rootScope.fechas.fechaIni  != undefined)?$rootScope.fechas.fechaIni.replace('-','').replace('-',''):'', ($rootScope.fechas.fechaFin != undefined)?$rootScope.fechas.fechaFin.replace('-','').replace('-',''):'',($rootScope.proveedor != undefined && $rootScope.proveedor != null)?$rootScope.proveedor.RFC:'')
            .then(function(res) {                
                $scope.orderList = res.data;
                console.log(res.data)
                totalElements = $scope.orderList.length;
                $scope.visible = true;
            })            
        }

    })
    //LQMA 25092017
    $scope.changeCompany = function(company) {
        
        console.log(company)
        var idCompani;

       if(company == null || company == undefined)
            idCompani = 0;            
       else
           idCompani = company.emp_idempresa      

        $rootScope.company = company;
        $rootScope.companyR = company;      

        //if (company.emp_idempresa != 0) {
        /* if(idCompani != 0) {
            $scope.branchSelectVisible = true;
            Branch.getByCompany(idCompani,$scope.currentUser.rfc
              ,$scope.currentUser.ppro_idUserRol,$scope.idProvider)
                .then(function(res) {
                    $rootScope.branchList = res.data;
                    //$rootScope.branch = $rootScope.branchList[0];
                    filterApply()
                })
        } else {
            filterApply()
            $scope.branchSelectVisible = false;
            //$rootScope.branch = null;
        }*/

         $scope.branchSelectVisible = true;
            Branch.getByCompany(idCompani,$scope.currentUser.rfc
              ,$scope.currentUser.ppro_idUserRol,$scope.idProvider)
                .then(function(res) {
                    $rootScope.branchList = res.data;
                    //$rootScope.branch = $rootScope.branchList[0];
                    filterApply()
                })

         if(idCompani != 0)
            $scope.branchSelectVisible = true;
         else
            $scope.branchSelectVisible = false;
    }

    //LQMA add 15092017
    $scope.initCalendarstyle = function() {
        $('#calendar .input-group.date').datepicker({
            todayBtn: "linked",
            keyboardNavigation: true,
            forceParse: false,
            calendarWeeks: true,
            autoclose: true,
            todayHighlight: true,
            format: "yyyy-mm-dd"
            //format: "dd/mm/yyyy"
        });
    };

    //LQMA 15092017 add obtiene Departamentos
    $scope.changeBranch = function(branch) {

        console.log(branch)
        var idBranch;

       if(branch == null || branch == undefined)
            idBranch = 0;            
       else
           idBranch = branch.suc_idsucursal      

        $rootScope.branch = branch;

//        if (branch.suc_idsucursal != 0) {//$scope.currentUser.ppro_idUserRol,$scope.idProvider)
            Branch.getDeptos(idBranch,$scope.idProvider)
                .then(function(res) {
                    $rootScope.deptosList = res.data;
                    //$rootScope.departamento = $rootScope.deptosList[0];
                    filterApply()
                })
  //      } else {
            
    //        filterApply()
            /*$scope.branchSelectVisible = false;
            $scope.branch = null;*/
      //  }
    }

    //LQMA comment 15092017
    $scope.changeDepto = function(depto) {
        $rootScope.departamento = depto;
    }

    //LQMA add 15092017 funcion para buscar
    $scope.search = function(){
        
        $rootScope.contador = 1;

        console.log('Proveedor: '+$scope.idProvider)
        console.log('rfc: '+ $scope.currentUser.rfc) 
        console.log('idUserRol: ',$scope.currentUser.ppro_idUserRol) 
        console.log('idEmpresa: ' ,($rootScope.company  == undefined || $rootScope.company == null)?0:$rootScope.company.emp_idempresa)
        console.log('idSucursal: ' ,($rootScope.branch  == undefined || $rootScope.branch == null)?0:$rootScope.branch.suc_idsucursal)
        console.log('idDepto: ', ($rootScope.departamento == undefined || $rootScope.departamento == null)?-1:$rootScope.departamento.dep_iddepartamento) 
        console.log('fechaIni: ', ($rootScope.fechaIni  != undefined)?$rootScope.fechaIni.replace('-','').replace('-',''):'') 
        console.log('fechaFin: ', ($rootScope.fechaFin != undefined)?$rootScope.fechaFin.replace('-','').replace('-',''):'')
        console.log('rfcProveedor: ', ($rootScope.proveedor != undefined && $rootScope.proveedor != null)?$rootScope.proveedor.RFC:'ooo')
        
        //LQMA 24012018 changed
        //Order.getPendingByProvider($scope.idProvider,$scope.currentUser.rfc,$scope.currentUser.ppro_idUserRol, ($rootScope.company == undefined || $rootScope.company == null)?0:$rootScope.company.emp_idempresa, ($rootScope.branch  == undefined || $rootScope.branch == null)?0:$rootScope.branch.suc_idsucursal, ($rootScope.departamento == undefined || $rootScope.departamento == null)?-1:$rootScope.departamento.dep_iddepartamento, ($rootScope.fechas.fechaIni  != undefined)?$rootScope.fechas.fechaIni.replace('-','').replace('-',''):'', ($rootScope.fechas.fechaFin != undefined)?$rootScope.fechas.fechaFin.replace('-','').replace('-',''):'',($rootScope.proveedor != undefined && $rootScope.proveedor != null)?$rootScope.proveedor.RFC:'')
         Order.getOPendientes($scope.idProvider,$scope.currentUser.rfc,$scope.currentUser.ppro_idUserRol, ($rootScope.company == undefined || $rootScope.company == null)?0:$rootScope.company.emp_idempresa, ($rootScope.branch  == undefined || $rootScope.branch == null)?0:$rootScope.branch.suc_idsucursal, ($rootScope.departamento == undefined || $rootScope.departamento == null)?-1:$rootScope.departamento.dep_iddepartamento, ($rootScope.fechas.fechaIni  != undefined)?$rootScope.fechas.fechaIni.replace('-','').replace('-',''):'', ($rootScope.fechas.fechaFin != undefined)?$rootScope.fechas.fechaFin.replace('-','').replace('-',''):'',($rootScope.proveedor != undefined && $rootScope.proveedor != null)?$rootScope.proveedor.RFC:'')
            .then(function(res) {                
                $scope.orderList = res.data;
                console.log(res.data)
                totalElements = $scope.orderList.length;
                $scope.visible = true;
                $('#modalPop').modal('hide');
            })
    }

    $scope.changeOrder = function(branch) {
        filterApply();
    }

    $scope.changeNoOrder = function(branch) {
        //console.log($scope.noOrder)

        totalElements = $filter('ordenServicio')($scope.orderList, $scope.noOrder).length;
        $scope.currentPage = 0;
    }    

    $scope.filtroDetalle = function() {        
        filterApplyDetail();
    }

    function filterApplyDetail() {        
        $filter('detalle')($scope.orderList.dep_nombre, $scope.detalleOrdenFiltro);
        $scope.currentPage = 0;
    }   

    $scope.uploadinvoice = function(order) {
        Order.pendingSeen(order.oce_folioorden).then(function(data) {
            $scope.orderList.forEach(function(o, i) {
                if (o.oce_folioorden === order.oce_folioorden) {
                    $scope.orderList[i].visto = 2;
                    console.log($scope.orderList[i].Recepcion)
                }
            })
            console.log(data)
            console.log( ' dentro del for')
        })

        File.order = {
            provider: $scope.idProvider,
            rfc: $scope.currentUser.rfc,
            rfcProvider: order.per_rfc,
            folio: order.oce_folioorden,
            idRol: $scope.currentUser.ppro_idUserRol,
            incomplete: order.incomplete,
            Recepcion: order.Recepcion
        };
        console.log(File.order)
    }

    function filterApply() {
        totalElements = $filter('filter')($filter('branch')(   ($filter('company')($scope.orderList, $rootScope.companyR))  ,$rootScope.branch),$scope.order).length;
        $scope.currentPage = 0;
    }
    //Pagination
    $scope.range = function() {
        var rangeSize = 5;
        var ret = [];
        var start;
        if ($scope.currentPage - 2 >= 0) {
            start = $scope.currentPage - 2;
        } else {
            start = 0;
        }
        if (start > $scope.pageCount() - rangeSize) {
            start = $scope.pageCount() - rangeSize + 1;
        }

        for (var i = start; i < start + rangeSize; i++) {
            if (i >= 0)
                ret.push(i);
        }
        return ret;
    };

    $scope.prevPage = function() {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };

    $scope.prevPageDisabled = function() {
        return $scope.currentPage === 0 ? "disabled" : "";
    };

    $scope.pageCount = function() {
        return Math.ceil(totalElements / $scope.itemsPerPage) - 1;
    };

    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.pageCount()) {
            $scope.currentPage++;
        }
    };

    $scope.nextPageDisabled = function() {
        return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
    };

    $scope.setPage = function(n) {
        $scope.currentPage = n;
    };

});
