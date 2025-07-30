"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, FileTextIcon, ShieldCheckIcon } from "lucide-react";

export default function TempTermsAndConditionsPage() {
  return (
    <div className="bg-gray-50 dark:bg-[#121212] min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="shadow-lg bg-white dark:bg-[#18181B]">
            <CardHeader className="text-center">
              <div className="inline-block bg-yellow-400 p-3 rounded-full mx-auto mb-4">
                <FileTextIcon className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Terms & Conditions
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Last updated: July 29, 2025
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 text-gray-700 dark:text-gray-300 px-6 md:px-10 pb-10">
              <Section title="Payment Process">
                <p>
                  Rental charges have to be paid in advance for the duration
                  chosen while booking the bike.
                </p>
              </Section>

              <Section title="Delay Charges">
                <p>
                  Late charges are applicable after a 30-minute grace period.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>
                    <strong>Scooters:</strong> ₹100 per hour, plus the daily
                    rental as applicable.
                  </li>
                  <li>
                    <strong>125-250cc Motorcycles:</strong> ₹150 per hour, plus
                    the daily rental as applicable.
                  </li>
                  <li>
                    <strong>300-500cc Motorcycles:</strong> ₹200 per hour, plus
                    the daily rental as applicable.
                  </li>
                  <li>
                    <strong>Entry Superbikes:</strong> ₹300 per hour, plus the
                    daily rental as applicable.
                  </li>
                  <li>
                    <strong>Superbikes:</strong> ₹500 per hour, plus the daily
                    rental as applicable.
                  </li>
                </ul>
              </Section>

              <Section title="Required Documents">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    The user must have a valid driving license and a copy of the
                    same should be submitted at the time of renting the vehicle.
                  </li>
                  <li>
                    The user must carry his/her original documents at the time
                    of the pickup which were uploaded on the website/App for
                    verification.
                  </li>
                  <li>
                    Documents issued by the government of India such as Aadhar
                    Card, Driver’s license, Passport, etc. will be considered as
                    valid ID and address proof. (Voter ID and Pan Card can be
                    provided as an additional document if required.)
                  </li>
                  <li>
                    If a user is unable to verify his/her identity then Torq
                    Rides reserve the right to deny the service and cancel the
                    booking with the 25% cancellation charges as per the policy.
                  </li>
                  <li>
                    International customers must have a valid International
                    Driving Permit, which allows them to ride a motorcycle or
                    drive a car in India, as applicable.
                  </li>
                </ul>
              </Section>

              <Section title="Use of Vehicle">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    The customer should have a valid driving license, be at
                    least 21 years old and must always wear a helmet while
                    riding.
                  </li>
                  <li>
                    The customer must wear appropriate riding gear, i.e...
                    riding boots or closed toe shoes, pants & eyewear. The
                    customer renting a motorcycle should ensure that he/she is
                    not wearing sandals/chappals or shorts, as the same is not
                    permitted by the law while riding a motorcycle.
                  </li>
                  <li>
                    Only the customer who has submitted his valid documents is
                    permitted to drive the vehicle.
                  </li>
                  <li>
                    The customer is responsible for his insurance; Torq Rides
                    Pvt Ltd will not be responsible for any accidental expenses
                    of the Rider(s) or the Pillion.
                  </li>
                  <li>
                    The customer shall use the bike entirely at his/her own risk
                    and agrees that Torq Rides Pvt Ltd will not accept any
                    responsibility or be held accountable for any loss, injury
                    or death as a result of, or leading from the use of any of
                    the vehicles.
                  </li>
                  <li>
                    The bike shall be returned back to Torq Rides Pvt Ltd in the
                    same condition in which it was handed over to the customer.
                  </li>
                  <li>
                    In case the vehicle returned is found excessively
                    dirty/muddy, the customer will have to bear the charge of
                    washing not exceeding 200 Rupees.
                  </li>
                  <li>
                    Rental package does not include Fuel, Toll, roadside
                    assistance (RSA) and Taxes.
                  </li>
                  <li>
                    The customer is responsible for any traffic violations
                    incurred due to your use of a rented vehicle. Torq Rides Pvt
                    Ltd is not liable for any costs from any such violation.
                  </li>
                  <li>
                    You must report such violations to a Torq Rides’
                    Representative as soon as possible.
                  </li>
                  <li>
                    Towing service will be borne by the customer in case of an
                    unlikely event of tire puncture or collision or breakdown
                    due to improper usage. In the event of mechanical or
                    technical failure, we will take care in towing the bike at
                    our own cost.
                  </li>
                  <li>
                    All our bikes have GPS tracking devices; we recommend that
                    you follow speed guidelines – our team gets automated
                    updates on the bikes that exceed speed limits.
                  </li>
                </ul>
              </Section>
              <Section title="Prohibited Uses">
                <p>
                  The use of a Torq Rides Pvt Ltd vehicle under the following
                  conditions is prohibited:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Our vehicles cannot be used for rallies and rally surcharges
                    or any format of professional or amateur competitions and
                    media usage.
                  </li>
                  <li>
                    By any person who is under the influence of (i) alcohol or
                    (ii) any drug or medication under the effects of which the
                    operation of a vehicle is prohibited or not recommended.
                  </li>
                  <li>
                    In carrying out any crime or any other illegal activity.
                  </li>
                </ul>
              </Section>
              <Section title="Delivery process">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    The customer has to be present at the agreed date and time
                    to pick up the bike.
                  </li>
                  <li>
                    Delivered vehicles cannot be rejected after handover. Once
                    accepted by the customer or his/her representative at the
                    time of pickup, the vehicle is not to be returned before the
                    agreed contract period. The customer should do a quality
                    test of the bike before he accepts the bike from Torq Rides
                    Pvt Ltd.
                  </li>
                  <li>
                    Though we do quality checks at our end before delivery, the
                    customer is expected to see if there are any damages and
                    report the same to the representative of Torq Rides Pvt Ltd
                    and photos shall be captured of the same.
                  </li>
                  <li>
                    One signed copy of the contract is to be kept by each party.
                  </li>
                </ul>
              </Section>
              <Section title="Right to refuse the service">
                <p>
                  The company holds the right of refusal to any client not
                  deemed fit to be served by the company or its authorised
                  staff.
                </p>
              </Section>
              <Section title="Handover Process">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Lessee has to inform us 2 hours in advance before the end of
                    the contract Period.
                  </li>
                  <li>
                    Pick-up date and time will be mutually decided by the
                    customer and us. The drop–off location will be the same as
                    the pick-up location.
                  </li>
                  <li>
                    The customer has to be present to deliver the bike at the
                    agreed date and time.
                  </li>
                </ul>
              </Section>
              <Section title="Damage Policy">
                <p>
                  The Lessee agrees to pay for any damage to, loss of, or any
                  theft (disappearance) of parts of bike, regardless of cause or
                  fault. Items damaged beyond repair will be paid for at its
                  Market Price.
                </p>
                <p>
                  The representative shall check the bike and its parts in order
                  to ascertain any damage to items. Damage shall be defined as
                  follows:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Any damage which existed prior to the handover of the
                    Motorbike and was agreed between the customer and Torq Rides
                    will not be chargeable to the Lessee.
                  </li>
                  <li>
                    Any variation showing damages, if ascertained as not caused
                    by normal wear and tear, would be charged and would have to
                    be borne by the customer
                  </li>
                </ul>
                <p>
                  In case of an accident or collision, the rider members are
                  accountable to pay for the repairs incurred due to damages
                  caused by the collision/accident, upto an amount not exceeding
                  the following depending on the motorcycle:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Scooters:</strong> ₹5,000
                  </li>
                  <li>
                    <strong>Motorcycles up to 500cc:</strong> ₹15,000
                  </li>
                  <li>
                    <strong>Motorcycles above 500cc:</strong> ₹50,000
                  </li>
                </ul>
                <p>
                  Any charges exceeding the above mentioned amounts will be
                  claimed from the insurance.
                </p>
                <p>
                  In the event of a collision, either due to the fault of the
                  rider himself or due to any other unavoidable instance, the
                  costs involved in towing or confiscation of Torq Rides bikes
                  are to be borne by the renters alone
                </p>
                <p>
                  Apart from the cost of repair in case of a large damage, due
                  to loss of inventory period for Torq Rides Pvt Ltd., customers
                  will be liable to pay a rental period of 3 days.
                </p>
              </Section>
              <Section title="Fuel Policy">
                <p>
                  Fuel is the customer's responsibility. We will be giving you
                  sufficient fuel to reach the nearest fuel pump. You will be
                  required to return the fuel at the same level as given. In
                  case the fuel level is lower than as given at the time of
                  handover, the customer will be charged the cost of lesser
                  fuel, and in addition to that, a low fuel fee of Rs.200 over
                  and above.
                </p>
              </Section>
              <Section title="Maintenance">
                <p>
                  The customer is liable for checking engine oils during a trip
                  and maintaining the vehicle while on road. Any mechanical
                  failures should be reported immediately. Customers may be held
                  responsible in case of a mechanical failure resulting due to
                  negligence of the normal maintenance while on the trip.
                </p>
              </Section>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-white dark:bg-[#18181B]">
            <CardHeader className="text-center">
              <div className="inline-block bg-yellow-400 p-3 rounded-full mx-auto mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Cancellation Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 text-gray-700 dark:text-gray-300 px-6 md:px-10 pb-10">
              <Section title="Booking Related">
                <li>
                  No show - 100% deduction and only security deposit will be
                  refunded
                </li>
                <li>
                  Between 0 - 72 hrs of the pick up time - 100% rental charges
                  will be withheld and security deposit will be refunded.
                </li>
                <li>
                  Between 72 hours to 7 days of the pick up time: 50% rental
                  charges will be withheld.
                </li>
                <li>
                  7 days or more prior to the pick up time: Rs.199 will be
                  charged as concellation fee.
                </li>
              </Section>
              <Section title="Extra charges such as the following will be applicable -">
                <li>
                  If a customer chooses an extra helmet on the spot, it will be
                  billed additionally on the spot, as applicable.
                </li>
                <li>
                  Excess Km - The excess km charges will be calculated at the
                  time of drop off and the customer will be required to pay the
                  same at the drop-off location.
                </li>
                <li>
                  Any damages will be inspected at the spot and the charges will
                  be collected on the spot as per the damage terms mentioned.
                </li>
              </Section>
              <Section title="Deposit">
                <p>
                  The customer has to deposit a refundable security deposit as
                  applicable to take a ride with us. The refund usually happens
                  within 30 mins of return of vehicle during the business hours,
                  but at times takes upto 72 working hours to reflect in the
                  source account from the date of return of vehicle.
                </p>
              </Section>
              <Section title="Over speeding">
                <p>
                  The vehicles have to be ridden within permissible limits. The
                  speed limit for each vehicle is different which will be
                  specified at the time of booking. You have to be under the
                  speed limit specified by the company or the speed limit
                  specified by the governing authority, whichever is lesser.
                </p>
              </Section>
              <Section title="Cap on riding km">
                <p>
                  The rider agrees to adhere to the km cap limit as applicable
                  for each vehicle. Any extra kms as applicable will be charged
                  as per the applicable plan, to the customer at the time of
                  return of vehicle.
                </p>
              </Section>
              <Section title="Process to Rent Helmet">
                <li>
                  One Helmet will be provided with each motorcycle/scooter.
                  Extra Helmet needs to be booked in advance.
                </li>
                <li>
                  If the helmet is damaged or lost, a charge equivalent to the
                  cost of the new helmet will be levied.
                </li>
              </Section>
              <Section title="Assumption of risk">
                <p>
                  FOR OPERATORS AND PASSENGERS OF VEHICLES OWNED OR CONTROLLED
                  BY Torq Rides Pvt Ltd. OPERATING UNDER THE TORQ RIDES brand
                  name.
                </p>
                <p>
                  The rider has been given the opportunity to operate ride upon
                  or otherwise use one or more motorcycles or other vehicles
                  owned or controlled by Torq Rides Pvt Ltd, OPERATING UNDER THE
                  TORQ RIDES BRAND.; (collectively, the “Company”; each such
                  company owned or controlled vehicle is referred to herein as a
                  “VEHICLE”).
                </p>
                <p>
                  The rider fully understands and acknowledges that operating or
                  riding on a vehicle is an activity that has its own unique,
                  inherent risks, and that serious injury or death could result
                  from operating or riding on a VEHICLE through no fault of his
                  own. The rider (customer) is voluntarily choosing to operate
                  and/or ride upon the VEHICLE.
                </p>
                <p>
                  By accepting the terms and conditions, THE RIDER EXPRESSLY
                  AGREE TO ASSUME THE ENTIRE RISK OF ANY ACCIDENTS, PROPERTY
                  DAMAGE OR PERSONAL INJURY, INCLUDING PERMANENT DISABILITY,
                  PARALYSIS AND DEATH, THAT HE/SHE MIGHT SUFFER AS A RESULT OF
                  HIM/HER OPERATING OR RIDING ON SUCH “VEHICLE”
                </p>
                <p>
                  Without limiting the foregoing, THE RIDER ASSUME ALL RISKS
                  ARISING FROM THE FOLLOWING: (i) the condition or safety of the
                  VEHICLE, any other vehicles or equipment, or any roadways,
                  premises or property; (ii) the repair or maintenance, or lack
                  thereof, of the VEHICLE or any other vehicles or equipment;
                  (iii) the use of, or failure to use, any safety devices or
                  safeguards; (iv) the conditions, qualifications, instructions,
                  rules or procedures under which any VEHICLE is used; (v) the
                  violation by me or by other operators or passengers of any
                  VEHICLE User Eligibility or Program Rules; (vi) any defective
                  or unreasonably dangerous products, components or VEHICLE;
                  (vii) the weather conditions during operation of any VEHICLE
                  and (viii) single and/or multi-vehicle accidents.
                </p>

                <p>
                  The rider at the time of booking and riding declares not to be
                  under the influence of alcohol, drugs, other illegal
                  substances, or any medications that may impair his/her
                  judgement or his/her ability to operate or ride a VEHICLE. The
                  rider agrees that he/she will not operate or ride on any
                  VEHICLE while under the influence of alcohol, drugs, other
                  illegal substances or any such medications.
                </p>
                <p>
                  The rider agrees to operate or ride on each VEHICLE safely,
                  defensively and within the limits of the law and own
                  abilities. The rider (customer) agrees to comply with all
                  rules and eligibility.
                </p>
                <p>
                  The rider also agrees to allow the company and their
                  respective dealers to contact him/her at the address,
                  telephone number and e-mail address provided below and gather
                  additional information about the VEHICLE and/or additional
                  information about other goods and services in which one may be
                  interested.
                </p>
              </Section>
              <Section title="Waiver and release of liability">
                <p>
                  FOR OPERATORS AND PASSENGERS OF VEHICLES (INCLUDING PROTOTYPE
                  VEHICLES) OWNED OR CONTROLLED BY TORQ RIDES PVT LTD, OPERATING
                  UNDER THE TORQ RIDES BRAND.
                </p>
                <p>
                  The rider (customer) on behalf of all heirs, personal
                  representatives, administrators, executors, successors and
                  assigns (collectively, “Heirs and Assigns”), for and in
                  considerations of the permission granted to him to operate,
                  ride upon or otherwise use one or more motorcycles or other
                  vehicles owned or controlled by Torq Rides Pvt. Ltd.,
                  operating under the Torq Rides brand (collectively, the
                  “Company”; each such company owned or controlled vehicle is
                  referred to herein as a “VEHICLE”), and for other valuable
                  considerations, the receipt and adequacy of which are hereby
                  acknowledged, RELEASE, WAIVE AND FOREVER DISCHARGE the Company
                  and each of their respective affiliated companies,
                  subsidiaries, officers, directors, employees, dealers,
                  distributors and agents (collective, the “Released Parties”),
                  from ANY AND ALL CLAIMS, DEMANDS, RIGHTS AND CAUSES OF ACTION
                  (Collectively, “Claims”) OF ANY KIND WHATSOEVER THAT THE RIDER
                  OR ANY OF HIS HEIRS AND ASSIGNS NOW HAVE OR LATER MAY HAVE
                  AGAINST ANY RELEASED PARTY RESULTING FROM, CONNECTED WITH OR
                  ARISING OUT OF MY OPERATION OF OR RIDING ON ANY VEHICLE,
                  REGARDLESS OF WHETHER SUCH CLAIMS RELATE TO THE DESIGN,
                  MANUFACTURE, REPAIR, OPERATION OR MAINTENANCE OF ANY VEHICLE
                  OR THE CONDITIONS, RULES, QUALIFICATIONS, INSTRUCTIONS OR
                  PROCEDURES UNDER WHICH ANY VEHICLE IS USED, OR ANY OTHER CAUSE
                  OR MATTER.
                </p>
                <p>
                  The rider (customer) acknowledges and understands that this
                  Release EXTENDS TO AND RELEASES AND DISCHARGES ANY AND ALL
                  CLAIMS he/she or any Heirs and Assigns have or later may have
                  against the Released Parties resulting from or arising out of
                  my operation or of riding on the VEHICLE including without
                  limitation all such Claims resulting from the NEGLIGENCE of
                  any Released Party, or arising from STRICT PRODUCT LIABILITY,
                  or resulting from any BREACH OF ANY EXPRESS OR IMPLIED
                  WARRANTY by any Released Party, and regardless of whether such
                  Claims now exist or hereafter arise or are known or unknown,
                  contingent or absolute, liquidated or unliquidated or foreseen
                  or unforeseen, or arise by operation of law or otherwise.
                </p>
                <p>
                  The rider (customer) acknowledges and understands that by
                  agreeing to this Release he/she and his/her Heirs and Assigns
                  AGREE NOT TO USE any or all of the Released Parties for any
                  injury, death or damage to myself, my property, any other
                  person or such other person’s property resulting from or
                  arising out of my operation of or riding on any VEHICLE
                </p>
                <p>
                  The rider(Lessee) acknowledge that he/she has been advised of
                  and agree to waive on his/her behalf and on behalf of his/her
                  Heirs and Assigns, and fully understand the effect of such
                  waiver, all benefits flowing from any state statute that would
                  otherwise limit the scope of this release, which provides: “A
                  general release does not extend to claims which[a person] does
                  not know or suspect to exist in his or her favour at the time
                  of executing the release, which if known by him or her must
                  have materially affected his or her settlement with the
                  released parties”.
                </p>
                <p>
                  The rider confirms that this release is intended to be as
                  broad and inclusive as is permitted by law. The extent and the
                  scope of this Release is unenforceable in any jurisdiction,
                  said scope will, as to such jurisdiction only, be
                  automatically limited to the extent necessary to make this
                  Release enforceable in such jurisdiction, without invalidating
                  any other person of this Release. The rider hereby waives any
                  right to bargain for different release or waiver of liability
                  terms.
                </p>
                <p>
                  BY AGREEING TO THIS DOCUMENT, THE RIDER CERTIFIES THAT HE/SHE
                  HAS READ THIS TERMS & CONDITIONS DOCUMENT AND FULLY UNDERSTAND
                  IT AND NOT RELYING ON ANY STATEMENTS OR REPRESENTATIONS OF ANY
                  OF THE RELEASED PARTIES, AND HAVE BEEN GIVEN THE OPPORTUNITY
                  AND SUFFICIENT TIME TO READ AND ASK QUESTIONS REGARDING THIS
                  TERMS AND CONDITIONS DOCUMENT.
                </p>
              </Section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <h3 className="font-semibold text-xl text-gray-800 dark:text-gray-200 border-b-2 border-yellow-400 pb-2 mb-3">
      {title}
    </h3>
    {children}
  </div>
);
