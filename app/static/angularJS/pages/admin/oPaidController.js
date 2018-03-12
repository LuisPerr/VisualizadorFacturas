app.controller('oPaidController', function($scope,$rootScope, $stateParams, $filter, Company, Branch, Order, File, User, Filtro) {
    /*$scope.companyList = [];
    $rootScope.branchList = [];*/
    $scope.orderList = [];
    $scope.itemsPerPage = 5;
    $scope.currentPage = 0;
    $scope.branchSelectVisible = false;
    $scope.visible = false;
    var totalElements;
    $scope.orderImport = "";
    $scope.orderName = "";
    $scope.orderDetail = "";
    $scope.currentUser;

    $rootScope.fechaIni = '';
    $rootScope.fechaFin = '';
    $rootScope.proveedor;


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


    User.me().then(function(data) {
        //console.log('myVar2',$rootScope.miVar); 
        //console.log($rootScope.company)

        $rootScope.contador = 1;
        
        if($rootScope.company != null)    
            $rootScope.empresaActual = $rootScope.company;    
        if($rootScope.branch != null)    
            $rootScope.branchActual = $rootScope.branch;    
        if($rootScope.departamento != null)    
            $rootScope.departamentoActual = $rootScope.departamento;

        console.log('contador: ',$rootScope.contador)

        //LQMA 15092017 add 
        $scope.initCalendarstyle();

        $scope.idProvider = data.data.ppro_userId
        $scope.currentUser = data.data;
        //Order.getPaidByProvider($scope.idProvider, $scope.currentUser.rfc, $scope.currentUser.ppro_idUserRol)
        
        //LQMA 23012018 cambio de metodo, por node 
        console.log('$scope.idProvider: ',$scope.idProvider)
        console.log('$scope.currentUser: ',$scope.currentUser)
        //Order.getPaidByProvider($scope.idProvider, $scope.currentUser.rfc, $scope.currentUser.ppro_idUserRol, ($rootScope.company == undefined || $rootScope.company == null)?0:$rootScope.company.emp_idempresa, ($rootScope.branch  == undefined || $rootScope.branch == null)?0:$rootScope.branch.suc_idsucursal, ($rootScope.departamento == undefined || $rootScope.departamento == null)?-1:$rootScope.departamento.dep_iddepartamento, ($rootScope.fechas.fechaIni  != undefined)?$rootScope.fechas.fechaIni.replace('-','').replace('-',''):'', ($rootScope.fechas.fechaFin != undefined)?$rootScope.fechas.fechaFin.replace('-','').replace('-',''):'',($rootScope.proveedor != undefined && $rootScope.proveedor != null)?$rootScope.proveedor.RFC:'')
        Order.getOPagadas($scope.idProvider, $scope.currentUser.rfc, $scope.currentUser.ppro_idUserRol, ($rootScope.company == undefined || $rootScope.company == null)?0:$rootScope.company.emp_idempresa, ($rootScope.branch  == undefined || $rootScope.branch == null)?0:$rootScope.branch.suc_idsucursal, ($rootScope.departamento == undefined || $rootScope.departamento == null)?-1:$rootScope.departamento.dep_iddepartamento, ($rootScope.fechas.fechaIni  != undefined)?$rootScope.fechas.fechaIni.replace('-','').replace('-',''):'', ($rootScope.fechas.fechaFin != undefined)?$rootScope.fechas.fechaFin.replace('-','').replace('-',''):'',($rootScope.proveedor != undefined && $rootScope.proveedor != null)?$rootScope.proveedor.RFC:'') 
            .then(function(res) {
                $scope.orderList = res.data;
                totalElements = $scope.orderList.length;
                $scope.visible = true;
            })
        /*
        Company.getByProvider($scope.idProvider, $scope.currentUser.rfc, $scope.currentUser.ppro_idUserRol)
            .then(function(res) {
                $scope.companyList = res.data;
                $scope.company = $scope.companyList[0];
            });*/      
                
    })

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

     //LQMA add 15092017 funcion para buscar
    $scope.search = function(){
        $rootScope.contador = 1;
        /*
        console.log('Proveedor: '+$scope.idProvider)
        console.log('rfc: '+ $scope.currentUser.rfc) 
        console.log('idUserRol: ',$scope.currentUser.ppro_idUserRol) 
        console.log('idEmpresa: ' ,($rootScope.company  == undefined || $rootScope.company == null)?0:$rootScope.company.emp_idempresa)
        console.log('idSucursal: ' ,($rootScope.branch  == undefined || $rootScope.branch == null)?0:$rootScope.branch.suc_idsucursal)
        console.log('idDepto: ', ($rootScope.departamento == undefined || $rootScope.departamento == null)?-1:$rootScope.departamento.dep_iddepartamento) 
        console.log('fechaIni: ', ($rootScope.fechaIni  != undefined)?$rootScope.fechaIni.replace('-','').replace('-',''):'') 
        console.log('fechaFin: ', ($rootScope.fechaFin != undefined)?$rootScope.fechaFin.replace('-','').replace('-',''):'')
        */
        //LQMA 23012018 cambio de metodo, por node        
        //Order.getPaidByProvider($scope.idProvider, $scope.currentUser.rfc, $scope.currentUser.ppro_idUserRol, ($rootScope.company == undefined || $rootScope.company == null)?0:$rootScope.company.emp_idempresa, ($rootScope.branch  == undefined || $rootScope.branch == null)?0:$rootScope.branch.suc_idsucursal, ($rootScope.departamento == undefined || $rootScope.departamento == null)?-1:$rootScope.departamento.dep_iddepartamento, ($rootScope.fechas.fechaIni  != undefined)?$rootScope.fechas.fechaIni.replace('-','').replace('-',''):'', ($rootScope.fechas.fechaFin != undefined)?$rootScope.fechas.fechaFin.replace('-','').replace('-',''):'',($rootScope.proveedor != undefined && $rootScope.proveedor != null)?$rootScope.proveedor.RFC:'')
        Order.getOPagadas($scope.idProvider, $scope.currentUser.rfc, $scope.currentUser.ppro_idUserRol, ($rootScope.company == undefined || $rootScope.company == null)?0:$rootScope.company.emp_idempresa, ($rootScope.branch  == undefined || $rootScope.branch == null)?0:$rootScope.branch.suc_idsucursal, ($rootScope.departamento == undefined || $rootScope.departamento == null)?-1:$rootScope.departamento.dep_iddepartamento, ($rootScope.fechas.fechaIni  != undefined)?$rootScope.fechas.fechaIni.replace('-','').replace('-',''):'', ($rootScope.fechas.fechaFin != undefined)?$rootScope.fechas.fechaFin.replace('-','').replace('-',''):'',($rootScope.proveedor != undefined && $rootScope.proveedor != null)?$rootScope.proveedor.RFC:'')
            .then(function(res) {
                $scope.orderList = res.data;
                totalElements = $scope.orderList.length;
                $scope.visible = true;
            })

    }


    $scope.changeCompany = function(company) {

        console.log(company)
        var idCompani;

       if(company == null || company == undefined)
            idCompani = 0;            
       else
           idCompani = company.emp_idempresa      

        $rootScope.company = company;      

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

        /*if (company.emp_idempresa != 0) {
            $scope.branchSelectVisible = true;
            Branch.getByCompany(company.emp_idempresa, $scope.currentUser.rfc,
               $scope.currentUser.ppro_idUserRol,$scope.idProvider)
                .then(function(res) {
                    $rootScope.branchList = res.data;
                    $rootScope.branch = $rootScope.branchList[0];
                    filterApply()
                })
        } else {
            filterApply()
            $scope.branchSelectVisible = false;
            $rootScope.branch = null;
        }*/
    }



    //LQMA comment 15092017
    $scope.changeDepto = function(depto) {
        $rootScope.departamento = depto;
    }

    /*$scope.changeBranch = function(branch) {
        filterApply();
    }*/
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

    $scope.changeOrder = function(branch) {
        filterApply();
    }

    //LQMA add 07022018
    $scope.uploadinvoice = function(order) {
        
        console.log('idProveedor: ',order.idProveedor);

        File.order = {
            provider: $scope.idProvider,
            rfc: $scope.currentUser.rfc,
            rfcProvider: order.per_rfc,
            folio: order.oce_folioorden,
            idRol: $scope.currentUser.ppro_idUserRol,
            idProveedor: order.idProveedor
        };
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

    function filterApply() {
        totalElements = $filter('filter')($filter('branch')(($filter('company')($scope.orderList, $scope.company)), $rootScope.branch), $scope.order).length;
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
