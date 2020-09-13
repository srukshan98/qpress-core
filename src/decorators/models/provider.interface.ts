import { QRequest } from './qrequest.model';
import { QResponse } from './qresponse.model';

export interface Provider {
	Request: QRequest;
	Response: QResponse;
}
