export class AirConditionerModel {
    mandatory: Array<MandatoryDeviceModel>;
    dev_name: string;
    network_name: string;
    power: boolean;
    target_temp: number;
    air_blow: number;
    timer_on: boolean;
    timer_on_time: number;
    timer_off: boolean;
    timer_off_time: number;
    start_time_s1: number;
    end_time_s1: number;
    weekday_s1: number;
    temp_s1: number;
    air_blow_s1: number;
    start_time_s2: number;
    end_time_s2: number;
    weekday_s2: number;
    temp_s2: number;
    air_blow_s2: number;
    temp: number;
    humidity: number;
    pm: number;
    time_stamp: Date;
}

export class AirPurifierModel {
    mandatory: Array<MandatoryDeviceModel>;
    dev_name: string;
    power: boolean;
    target_humi: number;
    air_blow: number;
    timer_on: boolean;
    timer_on_time: number;
    timer_off: boolean;
    timer_off_time: number;
    start_time_s1: number;
    end_time_s1: number;
    weekday_s1: number;
    humi_s1: number;
    air_blow_s1: number;
    start_time_s2: number;
    end_time_s2: number;
    weekday_s2: number;
    humi_s2: number;
    air_blow_s2: number;
    temp: number;
    humi: number;
    pm: number;
    time_stamp: Date;
}

export class RemoteModel {
    mandatory: Array<MandatoryDeviceModel>;
    dev_name: string;
    temp: number;
    humi: number;
    pm: number;
    time_stamp: Date;
}

export class MandatoryDeviceModel {
    node_id: number;
    dev_id: string;
    dev_type: number;
    parent: number;
    child_a: number;
    child_b: number;
    child_c: number;
    child_d: number;
}