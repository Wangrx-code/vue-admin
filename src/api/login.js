import service from "@/utils/request";

export function GetSms(data) {
    return service.request({
        method: 'POST',
        url: '/getSms/',
        data
    });
};