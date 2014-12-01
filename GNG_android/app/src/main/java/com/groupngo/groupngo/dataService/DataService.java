package com.groupngo.groupngo.dataService;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.util.Log;

import com.groupngo.groupngo.OnTaskCompleted;
import com.groupngo.groupngo.TripFragment;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Helper class for providing sample content for user interfaces created by
 * Android template wizards.
 * <p/>
 * TODO: Replace all uses of this class before publishing your app.
 */
public class DataService {

    private static String baseURL = "http://groupngo.website/api";
    /**a
     * An array of sample (dummy) items.
     */
    public static ArrayList<TripItem> ITEMS = new ArrayList<TripItem>();

    public static ArrayList<String> TRIPMEMBERS = new ArrayList<String>();

    /**
     * A map of sample (dummy) items, by ID.
     */
    public static Map<String, JSONObject> ITEM_MAP = new HashMap<String, JSONObject>();

    static {
        // Add 3 sample items.
//        addItem("1", "2", "3");
    }

    private static void addItem(String id, String slocation, String elocation) {
        ITEMS.add(new TripItem(id, slocation, elocation));
//        try {
//            String id = item.getString("ID");
//            ITEM_MAP.put(id, item);

//        } catch(JSONException e) {

//        };

    }

    private static void clearItems() {
        ITEMS.clear();
    }

    /**
     * A dummy item representing a piece of content.
     */
    public static class TripItem {
        public String id;
        public String slocation;
        public String elocation;

        public TripItem(String id, String slocation, String elocation) {
            this.id = id;
            this.slocation = slocation;
            this.elocation = elocation;
        }

        @Override
        public String toString() {
            return slocation;
        }
    }

    private static void addTripMember(String fname, String lname) {
        TRIPMEMBERS.add(fname + " " + lname);
    }

    private static void clearTripMembers() {
        TRIPMEMBERS.clear();
    }

    public static class loadTrips extends AsyncTask<String, String, String>{

        private String url = baseURL + "/trips";

        private OnTaskCompleted listener;

        public loadTrips(OnTaskCompleted listener, String cuc) {

            this.listener = listener;
            execute(cuc);
        }

        @Override
        protected String doInBackground(String... params) {
//            Log.d("cuc in loadtrips", params[0]);
            HttpClient httpclient = new DefaultHttpClient();
            HttpResponse response;
            String responseString = null;
            JSONObject result = null;
            HttpGet httpGet = new HttpGet(url);
            httpGet.setHeader("cuc", params[0]);
            try {
                response = httpclient.execute(httpGet);
                StatusLine statusLine = response.getStatusLine();
                if(statusLine.getStatusCode() == HttpStatus.SC_OK){
//                    ByteArrayOutputStream out = new ByteArrayOutputStream();
//                    response.getEntity().writeTo(out);
//                    out.close();
//                    responseString = out.toString();

                    HttpEntity entity = response.getEntity();
                    if (entity != null) {
                        responseString = EntityUtils.toString(entity);
                        // parsing JSON
                    }
                } else{
                    //Closes the connection.
                    response.getEntity().getContent().close();
                    throw new IOException(statusLine.getReasonPhrase());
                }
            } catch (ClientProtocolException e) {
                //TODO Handle problems..
            } catch (IOException e) {
                //TODO Handle problems..
            }
            return responseString;
        }


        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);
            //Do anything with response..

            clearItems();
            try {
                JSONArray data = new JSONArray(result); //Convert String to JSON Object
                for (int i = 0; i < data.length(); i++) {
                    JSONObject trip = data.getJSONObject(i);
                    String tripID = trip.getString("ID");
                    String slocation = trip.getJSONObject("slocation").getString("name");
                    String elocation = trip.getJSONObject("elocation").getString("name");

                    addItem(tripID, slocation, elocation);
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
            Log.d("data", result);
            listener.onTaskCompleted();


        }
    }

    public static class postTrip extends AsyncTask<String, String, String>{

        private String url = baseURL + "/trips";

        public postTrip(String cuc, String slocation, String elocation) {
            execute(cuc, slocation, elocation);
        }

        @Override
        protected String doInBackground(String... params) {
            HttpClient httpclient = new DefaultHttpClient();
            HttpResponse response;
            String responseString = null;
            JSONObject result = null;
            HttpPost httpPost = new HttpPost(url);
            httpPost.setHeader("cuc", params[0]);
            httpPost.setHeader("slocation", params[1]);
            httpPost.setHeader("elocation", params[2]);
            try {
                response = httpclient.execute(httpPost);
                StatusLine statusLine = response.getStatusLine();
                if(statusLine.getStatusCode() == HttpStatus.SC_OK){
//                    ByteArrayOutputStream out = new ByteArrayOutputStream();
//                    response.getEntity().writeTo(out);
//                    out.close();
//                    responseString = out.toString();

                    HttpEntity entity = response.getEntity();
                    if (entity != null) {
                        responseString = EntityUtils.toString(entity);
                        // parsing JSON
                    }
                } else{
                    //Closes the connection.
                    response.getEntity().getContent().close();
                    throw new IOException(statusLine.getReasonPhrase());
                }
            } catch (ClientProtocolException e) {
                //TODO Handle problems..
            } catch (IOException e) {
                //TODO Handle problems..
            }
            return responseString;
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);
            //Do anything with response..

        }
    }

    public static class searchTrips extends AsyncTask<String, String, String>{

        private String url;

        private OnTaskCompleted listener;

        public searchTrips(OnTaskCompleted listener, String cuc, String slocation) {
            url = baseURL + "/close?slocation=" + slocation;
            this.listener = listener;
            execute(cuc);
        }

        @Override
        protected String doInBackground(String... params) {
            HttpClient httpclient = new DefaultHttpClient();
            HttpResponse response;
            String responseString = null;
            JSONObject result = null;
            HttpGet httpGet = new HttpGet(url);
            httpGet.setHeader("cuc", params[0]);
            try {
                response = httpclient.execute(httpGet);
                StatusLine statusLine = response.getStatusLine();
                if(statusLine.getStatusCode() == HttpStatus.SC_OK){
//                    ByteArrayOutputStream out = new ByteArrayOutputStream();
//                    response.getEntity().writeTo(out);
//                    out.close();
//                    responseString = out.toString();

                    HttpEntity entity = response.getEntity();
                    if (entity != null) {
                        responseString = EntityUtils.toString(entity);
                        // parsing JSON
                    }
                } else{
                    //Closes the connection.
                    response.getEntity().getContent().close();
                    throw new IOException(statusLine.getReasonPhrase());
                }
            } catch (ClientProtocolException e) {
                //TODO Handle problems..
            } catch (IOException e) {
                //TODO Handle problems..
            }
            return responseString;
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);
            //Do anything with response..
            clearItems();
            try {
                JSONArray data = new JSONArray(result); //Convert String to JSON Object
                for (int i = 0; i < data.length(); i++) {
                    JSONObject trip = data.getJSONObject(i);
                    String tripID = trip.getString("ID");
                    String slocation = trip.getJSONObject("slocation").getString("name");
                    String elocation = trip.getJSONObject("elocation").getString("name");

                    addItem(tripID, slocation, elocation);
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
            Log.d("data", result);
            listener.onTaskCompleted();
        }
    }

    public static class getTripDetail extends AsyncTask<String, String, String>{

        private String url;

        private OnTaskCompleted listener;

        public getTripDetail(OnTaskCompleted listener, String cuc, String id) {
            url = baseURL + "/trips/" + id;
            this.listener = listener;
            execute(cuc);
        }

        @Override
        protected String doInBackground(String... params) {
            HttpClient httpclient = new DefaultHttpClient();
            HttpResponse response;
            String responseString = null;
            JSONObject result = null;
            HttpGet httpGet = new HttpGet(url);
            httpGet.setHeader("cuc", params[0]);
            try {
                response = httpclient.execute(httpGet);
                StatusLine statusLine = response.getStatusLine();
                if(statusLine.getStatusCode() == HttpStatus.SC_OK){
//                    ByteArrayOutputStream out = new ByteArrayOutputStream();
//                    response.getEntity().writeTo(out);
//                    out.close();
//                    responseString = out.toString();

                    HttpEntity entity = response.getEntity();
                    if (entity != null) {
                        responseString = EntityUtils.toString(entity);
                        // parsing JSON
                    }
                } else{
                    //Closes the connection.
                    response.getEntity().getContent().close();
                    throw new IOException(statusLine.getReasonPhrase());
                }
            } catch (ClientProtocolException e) {
                //TODO Handle problems..
            } catch (IOException e) {
                //TODO Handle problems..
            }
            return responseString;
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);
            //Do anything with response..
            clearTripMembers();
            try {
                JSONArray data = new JSONArray(result); //Convert String to JSON Object
                for (int i = 0; i < data.length(); i++) {
                    JSONObject member = data.getJSONObject(i);

                    String fname = member.getString("FirstName");
                    String lname = member.getString("LastName");
                    addTripMember(fname, lname);
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
//            Log.d("data", result);
            listener.onTaskCompleted();
        }
    }

    public static class joinTrip extends AsyncTask<String, String, String>{

        private String url;

        private OnTaskCompleted listener;

        public joinTrip(OnTaskCompleted listener, String cuc, String id) {
            url = baseURL + "/trips/" + id;
            this.listener = listener;
            execute(cuc);
        }

        @Override
        protected String doInBackground(String... params) {
            HttpClient httpclient = new DefaultHttpClient();
            HttpResponse response;
            String responseString = null;
            JSONObject result = null;
            HttpPost httpPost = new HttpPost(url);
            httpPost.setHeader("cuc", params[0]);
            try {
                response = httpclient.execute(httpPost);
                StatusLine statusLine = response.getStatusLine();
                if(statusLine.getStatusCode() == HttpStatus.SC_OK){
//                    ByteArrayOutputStream out = new ByteArrayOutputStream();
//                    response.getEntity().writeTo(out);
//                    out.close();
//                    responseString = out.toString();

                    HttpEntity entity = response.getEntity();
                    if (entity != null) {
                        responseString = EntityUtils.toString(entity);
                        // parsing JSON
                    }
                } else{
                    //Closes the connection.
                    response.getEntity().getContent().close();
                    throw new IOException(statusLine.getReasonPhrase());
                }
            } catch (ClientProtocolException e) {
                //TODO Handle problems..
            } catch (IOException e) {
                //TODO Handle problems..
            }
            return responseString;
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);
            //Do anything with response..
            clearTripMembers();

//            Log.d("data", result);
            listener.onTaskCompleted();
        }
    }
}
