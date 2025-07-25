import request from '../config/axios.js';
import { envConfig } from '../config/env.js';
import { ENDPOINT } from '../constants/endpoint.js';
import { HTTP_METHOD } from '../constants/http.js';

export const getProvince = async (req, res) => {
    const response = await request({
        method: HTTP_METHOD.GET,
        url: ENDPOINT.GET_PROVINCE,
    });
    const filterProvinceId = [2002, 298, 290, 286];
    const dataFiltered = response.data.filter((item) => !filterProvinceId.includes(item.ProvinceID));
    const newResponse = {
        code: response.code,
        message: response.message,
        data: dataFiltered
    }
    return newResponse;
};

export const getDistrict = async (req, res) => {
    try {
        const response = await request({
            method: HTTP_METHOD.GET,
            url: ENDPOINT.GET_DISTRICT,
            data: {
                province_id: JSON.parse(req.query.provinceId),
            },
        });
        return response;
    } catch (error) {
        console.log(error);
    }
};

export const getWard = async (req, res) => {
    try {
        const response = await request({
            method: HTTP_METHOD.GET,
            url: ENDPOINT.GET_WARD,
            params: {
                district_id: JSON.parse(req.query.districtId),
            },
        });
        return response;
    } catch (error) {
        console.log(error);
    }
};

export const getService = async (req, res) => {
    try {
        const response = await request({
            method: HTTP_METHOD.GET,
            url: ENDPOINT.GET_SERVICE,
            params: {
                shop_id: envConfig.shipping.shopId,
                from_district: envConfig.shipping.fromDistrictId,
                to_district: JSON.parse(req.query.toDistrict),
            },
        });

        return response;
    } catch (error) {
        console.log(error);
    }
};

export const calculateShippingFee = async (req, res) => {
    try {
        const params = {
            from_district_id: +envConfig.shipping.fromDistrictId,
            from_ward_code: +envConfig.shipping.fromWardCode,
            service_id: JSON.parse(req.query.serviceId),
            // service_type_id: JSON.parse(req.query.serviceTypeId as string) || null,
            to_district_id: JSON.parse(req.query.toDistrictId),
            to_ward_code: req.query.toWardCode,
            height: 50,
            length: 20,
            weight: 200,
            width: 20,
            // insurance_value:10000,
            // cod_failed_amount: 2000,
            // insurance_value: Number(req.query.insuranceValue) || 0,
            // cod_failed_amount: Number(req.query.codFailedAmount) || 0,
            // coupon: JSON.parse(req.query.coupon as string) || null,
        };
        const response = await request({
            method: HTTP_METHOD.GET,
            url: ENDPOINT.CALCULATE_SHIPPING_FEE,
            params,
        });
        return response;
    } catch (error) {
        console.log('error', error);
    }
};

// Get pick shift
export const getPickShift = async (req, res) => {
    const response = await request({
        method: HTTP_METHOD.GET,
        url: ENDPOINT.GET_PICK_SHIFT,
    });

    return response;
};

// Create a new  order
export const createOrder = async (req, res) => {
    const data = {
        payment_type_id: 2,
        note: req.body.note,
        required_note: req.body.requiredNote,
        from_name: req.body.fromName,
        from_phone: req.body.fromPhone,
        from_address: req.body.fromAddress,
        from_ward_name: req.body.fromWardName,
        from_district_name: req.body.fromDistrictName,
        from_province_name: req.body.fromProvinceName,
        return_phone: req.body.returnPhone,
        return_address: req.body.returnAddress,
        return_district_id: req.body.returnDistrictId,
        return_ward_code: req.body.returnWardCode,
        client_order_code: req.body.clientOrderCode,
        to_name: req.body.toName,
        to_phone: req.body.toPhone,
        to_address: req.body.toAddress,
        to_ward_code: req.body.toWardCode,
        to_district_id: req.body.toDistrictId,
        cod_amount: req.body.codAmount,
        content: req.body.content,
        weight: req.body.weight,
        length: req.body.length,
        width: req.body.width,
        height: req.body.height,
        pick_station_id: req.body.pickStationId,
        deliver_station_id: req.body.deliverStationId,
        insurance_value: req.body.insuranceValue,
        service_id: req.body.serviceId,
        service_type_id: req.body.serviceTypeId,
        coupon: req.body.coupon,
        pick_shift: req.body.pickShift,
        items: req.body.items,
    };

    let response = null;
    try {
        response = await request({
            method: HTTP_METHOD.POST,
            url: ENDPOINT.CREATE_ORDER,
            data,
        });
    } catch (error) {
        console.log(error);
    }

    return response;
};
